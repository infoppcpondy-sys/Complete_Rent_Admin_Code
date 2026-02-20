const express = require('express');
const router = express.Router();
const { SNSClient, PublishCommand } = require("@aws-sdk/client-sns");
const AdminLogin = require('../Admin/AdminModel');
const bcrypt = require('bcrypt');

// AWS SNS Client Configuration
const snsClient = new SNSClient({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

// Generate OTP (6-digit)
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Send Admin OTP via AWS SNS
async function sendAdminOTP(phoneNumber, adminName, otp) {
  const formattedPhone = phoneNumber.startsWith('+')
    ? phoneNumber
    : `+91${phoneNumber}`;

  // Message format: "hi {adminName} your Pondicherry Matrimony Admin Login OTP {otp} for RP"
  const message = `hi ${adminName} your Pondicherry Matrimony Admin Login OTP ${otp} for RP`;

  const params = {
    PhoneNumber: formattedPhone,
    Message: message,
    MessageAttributes: {
      'AWS.SNS.SMS.SenderID': {
        DataType: 'String',
        StringValue: process.env.SENDER_ID || 'PONDYY',
      },
      'AWS.SNS.SMS.SMSType': {
        DataType: 'String',
        StringValue: 'Transactional',
      },
      'AWS.MM.SMS.EntityId': {
        DataType: 'String',
        StringValue: process.env.DLT_ENTITY_ID,
      },
      'AWS.MM.SMS.TemplateId': {
        DataType: 'String',
        StringValue: process.env.DLT_TEMPLATE_ID,
      },
    },
  };

  try {
    const result = await snsClient.send(new PublishCommand(params));
    console.log(`[Admin OTP] ✅ Sent to ${adminName} (${phoneNumber}):`, result.MessageId);
    return { success: true, messageId: result.MessageId };
  } catch (error) {
    console.error(`[Admin OTP] ❌ Failed for ${adminName}:`, error.message);
    throw error;
  }
}

// OTP Store (in-memory) - for verification
const otpStore = {};

// Save OTP for verification
function storeAdminOTP(adminName, otp) {
  otpStore[adminName] = {
    otp,
    expiresAt: Date.now() + 5 * 60 * 1000, // 5 minutes expiry
  };
}

// Verify OTP
function verifyAdminOTP(adminName, enteredOtp) {
  const data = otpStore[adminName];
  if (!data) return { success: false, message: 'No OTP requested' };

  if (Date.now() > data.expiresAt) {
    delete otpStore[adminName];
    return { success: false, message: 'OTP expired' };
  }

  if (data.otp !== enteredOtp) {
    return { success: false, message: 'Invalid OTP' };
  }

  delete otpStore[adminName]; // Clear after successful verification
  return { success: true, message: 'OTP verified successfully' };
}

// ============================================
// MAIN ROUTES
// ============================================

// --- POST /adminlogin-rent ---
// Admin login with credentials
router.post('/adminlogin-rent', async (req, res) => {
  const { name, password, role, userType } = req.body;

  try {
    // Validate input
    if (!name || !password || !role || !userType) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Find admin by name
    const admin = await AdminLogin.findOne({ name });
    if (!admin) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Verify password using bcrypt
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Password is incorrect' });
    }

    // Verify role and userType
    if (admin.role !== role || admin.userType !== userType) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // ✅ Update last login date
    admin.lastLogin = new Date();
    await admin.save();

    // Success - return admin data
    return res.status(200).json({
      message: 'Login successful',
      data: {
        name: admin.name,
        role: admin.role,
        userType: admin.userType,
        mobile: admin.mobile,
        lastLogin: admin.lastLogin,
      },
    });
  } catch (error) {
    console.error('[Admin Login] Error:', error.message);
    return res.status(500).json({ 
      message: 'Something went wrong', 
      error: error.message 
    });
  }
});

// --- POST /admin-send-otp-login-rent ---
// Send OTP to admin's registered phone
router.post('/admin-send-otp-login-rent', async (req, res) => {
  try {
    const { adminName } = req.body;

    if (!adminName) {
      return res.status(400).json({ 
        success: false, 
        message: 'Admin name is required' 
      });
    }

    // Find admin by name
    const admin = await AdminLogin.findOne({ name: adminName });
    if (!admin) {
      return res.status(404).json({ 
        success: false, 
        message: 'Admin not found' 
      });
    }

    if (!admin.mobile) {
      return res.status(400).json({ 
        success: false, 
        message: 'Mobile number not found for this admin' 
      });
    }

    // Generate OTP
    const otp = generateOTP();
    console.log(`[Admin OTP] Generated for ${adminName}: ${otp}`);

    // Send OTP via AWS SNS
    try {
      await sendAdminOTP(admin.mobile, adminName, otp);
      
      // Store OTP for later verification
      storeAdminOTP(adminName, otp);

      return res.status(200).json({
        success: true,
        message: 'OTP sent successfully to registered mobile number',
      });
    } catch (snsError) {
      console.error('[SNS Error]:', snsError.message);
      return res.status(500).json({
        success: false,
        message: 'Failed to send OTP. Please try again.',
        error: snsError.message,
      });
    }
  } catch (error) {
    console.error('[Admin Send OTP] Error:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message,
    });
  }
});

// --- POST /verify-otp-login-admin-rent ---
// Verify OTP for login
router.post('/verify-otp-login-admin-rent', async (req, res) => {
  try {
    const { adminName, otp } = req.body;

    if (!adminName || !otp) {
      return res.status(400).json({ 
        success: false, 
        message: 'Admin name and OTP are required' 
      });
    }

    const result = verifyAdminOTP(adminName, otp);
    if (!result.success) {
      return res.status(401).json({ 
        success: false, 
        message: result.message 
      });
    }

    return res.status(200).json({
      success: true,
      message: result.message,
    });
  } catch (error) {
    console.error('[Verify OTP Login] Error:', error.message);
    return res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    });
  }
});

// ============================================
// ADMIN MANAGEMENT ROUTES
// ============================================

// ✅ GET: Get all admins (excluding passwords)
router.get('/get-all-admins', async (req, res) => {
  try {
    const admins = await AdminLogin.find({}, '-password');
    res.status(200).json({ data: admins });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// ✅ GET: Get admin logs with pagination
router.get('/get-admin-logs', async (req, res) => {
  const { page = 1, limit = 10 } = req.query;

  try {
    const logs = await AdminLogin.find()
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .sort({ date: -1 });

    const totalLogs = await AdminLogin.countDocuments();

    return res.status(200).json({
      logs,
      totalLogs,
      totalPages: Math.ceil(totalLogs / limit),
      currentPage: page
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Server Error',
      error: error.message
    });
  }
});

// ✅ POST: Create new admin
router.post('/admin-create', async (req, res) => {
  const newUser = new AdminLogin({
    name: req.body.name,
    address: req.body.address,
    office: req.body.office,
    jobType: req.body.jobType,
    targetWeek: req.body.targetWeek,
    targetMonth: req.body.targetMonth,
    mobile: req.body.mobile,
    aadhaarNumber: req.body.aadhaarNumber,
    userName: req.body.userName,
    password: req.body.password,
    role: req.body.role,
    userType: req.body.userType
  });

  try {
    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// ✅ POST: Create admin (with plainPassword storage)
router.post('/admin-creates', async (req, res) => {
  try {
    const newUser = new AdminLogin({
      name: req.body.name,
      address: req.body.address,
      office: req.body.office,
      jobType: req.body.jobType,
      targetWeek: req.body.targetWeek,
      targetMonth: req.body.targetMonth,
      mobile: req.body.mobile,
      aadhaarNumber: req.body.aadhaarNumber,
      userName: req.body.userName,
      password: req.body.password,
      plainPassword: req.body.password,
      role: req.body.role,
      userType: req.body.userType
    });

    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// ✅ GET: Get all admins
router.get('/admin-all', async (req, res) => {
  try {
    const users = await AdminLogin.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ✅ GET: Get all admins (including all fields)
router.get('/admin-lists', async (req, res) => {
  try {
    const admins = await AdminLogin.find({});
    res.status(200).json({ data: admins });
  } catch (err) {
    console.error("❌ Fetch error:", err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// ✅ GET: Get single admin by ID
router.get('/admin/:id', async (req, res) => {
  try {
    const user = await AdminLogin.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'Admin not found' });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Error', error: err.message });
  }
});

// ✅ POST: Update admin by ID
router.post('/admin-update/:id', async (req, res) => {
  try {
    const user = await AdminLogin.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    // Update fields conditionally
    const fields = [
      'name', 'address', 'office', 'jobType', 'targetWeek', 'targetMonth',
      'mobile', 'aadhaarNumber', 'userName', 'role', 'userType'
    ];

    fields.forEach(field => {
      if (req.body[field] != null) {
        user[field] = req.body[field];
      }
    });

    // Handle password update with hashing
    if (req.body.password != null) {
      user.password = req.body.password;
      user.plainPassword = req.body.password;
    }

    const updatedUser = await user.save();
    res.status(200).json({
      message: 'User updated successfully',
      data: updatedUser
    });
  } catch (err) {
    console.error('Update error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// ✅ POST: Update admin v2
router.post('/admin-updates/:id', async (req, res) => {
  try {
    const user = await AdminLogin.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    const fields = [
      'name', 'address', 'office', 'officeName', 'jobType', 'targetWeek', 'targetMonth',
      'mobile', 'aadhaarNumber', 'userName', 'role', 'userType'
    ];

    fields.forEach(field => {
      if (req.body[field] != null) {
        user[field] = req.body[field];
      }
    });

    if (req.body.password) {
      user.password = req.body.password;
      user.plainPassword = req.body.password;
    }

    const updated = await user.save();
    res.status(200).json({ message: 'User updated', data: updated });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// ✅ DELETE: Delete admin by ID
router.delete('/admin-delete/:id', async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await AdminLogin.findByIdAndDelete(userId);
    
    if (!user) {
      return res.status(404).json({ message: 'Admin not found' });
    }
    
    res.status(200).json({ message: 'Admin deleted successfully', data: user });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// ============================================
// EXPORT ROUTER (SINGLE EXPORT - NO DUPLICATES)
// ============================================

module.exports = router;
