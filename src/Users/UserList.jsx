import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './UserList.css';
import { FaEdit } from 'react-icons/fa';
import { MdDeleteForever } from 'react-icons/md';
import { Table } from 'react-bootstrap';

const UserForm = ({ user, onSave, onDelete }) => {
    const [formData, setFormData] = useState({
        name: '',
        address: '',
        office: '',
        jobType: '',
        targetWeek: '',
        targetMonth: '',
        mobile: '',
        aadhaarNumber: '',
        userName: '',
        password: '',
        role: '',
        userType: ''
    });

    const [offices, setOffices] = useState([]); // State to store offices
    const [roles, setRoles] = useState([]); // State to store roles from API
    const [loading, setLoading] = useState(false);
    const [rolesLoading, setRolesLoading] = useState(false);

    // Fetch offices from API
    useEffect(() => {
        const fetchOffices = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/office-all-rent`);
                setOffices(response.data);
            } catch (error) {
                console.error('Failed to fetch offices:', error);
                toast.error('Failed to load offices');
            } finally {
                setLoading(false);
            }
        };

        fetchOffices();
    }, []);

    // Fetch roles from API
    useEffect(() => {
        const fetchRoles = async () => {
            try {
                setRolesLoading(true);
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/roll-all-rent`);
                // Extract rollType from each role object
                const roleData = response.data.map(role => ({
                    value: role.rollType,
                    label: role.rollType
                }));
                setRoles(roleData);
            } catch (error) {
                console.error('Failed to fetch roles:', error);
                toast.error('Failed to load roles');
                // Fallback to default roles if API fails
                setRoles([
                    { value: 'manager', label: 'Manager' },
                    { value: 'admin', label: 'Admin' },
                    { value: 'accountant', label: 'Accountant' }
                ]);
            } finally {
                setRolesLoading(false);
            }
        };

        fetchRoles();
    }, []);

    // Update formData when user prop is passed (for update scenario)
    useEffect(() => {
        if (user) {
            setFormData(user);
        }
    }, [user]);

    // If offices load after selecting a user for edit, ensure office is set to officeName for the select control
    useEffect(() => {
        if (offices.length && user && user.office) {
            const found = offices.find(o => o.officeName === user.office || o._id === user.office);
            if (found) {
                setFormData(prev => ({ ...prev, office: found.officeName }));
            }
        }
    }, [offices, user]);

    // Handle input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: value
        }));
    };

    useEffect(() => {
        if (user && user._id) {
            axios.get(`${process.env.REACT_APP_API_URL}/admin/${user._id}`)
                .then(res => {
                    const data = res.data;
                    setFormData({
                        ...data,
                        password: data.plainPassword || ''
                    });
                })
                .catch(err => console.error('Error fetching user:', err));
        }
    }, [user]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Client-side validations to match backend enums
        if (!formData.password || String(formData.password).trim() === '') {
            toast.error('Password is required');
            return;
        }

        // Ensure selected office exists in fetched offices (accept either _id or officeName for compatibility)
        const officeIds = offices.map(o => o._id);
        const officeNames = offices.map(o => o.officeName);
        const officeSelectedValid = !formData.office || officeIds.includes(formData.office) || officeNames.includes(formData.office);
        if (!officeSelectedValid) {
            toast.error('Please select an office from the dropdown list');
            return;
        }

        // Ensure role matches one of the fetched roles (exact match)
        const roleValues = roles.map(r => r.value);
        if (formData.role && !roleValues.includes(formData.role)) {
            toast.error('Please select a role from the dropdown list');
            return;
        }

        try {
                // Send office as officeName (the backend expects the office name string, not _id)
                const payload = { ...formData };
                // office is already the officeName from the select dropdown

                if (user && user._id) {
                    await axios.post(`${process.env.REACT_APP_API_URL}/admin-updates/${user._id}`, payload);
                    toast.success('User updated successfully!');
                } else {
                    const res = await axios.post(`${process.env.REACT_APP_API_URL}/admin-creates`, payload);
                    // If API returns created user, you can use it; otherwise just notify
                    toast.success(res?.data?.message || 'User created successfully!');
                }
                onSave();
            } catch (err) {
                const serverMsg = err?.response?.data?.message || err?.response?.data || err?.message;
                toast.error(`Error saving user: ${serverMsg}`);
                console.error('Create/Update user error:', err);
            }
    };

    // Handle user deletion
    const handleDelete = async () => {
        try {
            if (user && window.confirm('Are you sure you want to delete this user?')) {
                await axios.delete(`${process.env.REACT_APP_API_URL}/admin-delete/${user._id}`);
                alert('User deleted successfully!');
                onDelete();
            }
        } catch (err) {
            alert('An error occurred while deleting!');
        }
    };

    return (
        <div>
            <ToastContainer />
            <h2>{user ? 'Update User' : 'Create New User(Staff)'}</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-row">
                    <div className="form-group">
                        <label>User Name: <span className='text-danger'><strong>*</strong></span></label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Address:</label>
                        <input
                            type="text"
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                        />
                    </div>
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label>Job Type:</label>
                        <select
                            name="jobType"
                            value={formData.jobType}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Select Job Type</option>
                            <option value="Full-time">Full-time</option>
                            <option value="Part-time">Part-time</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Target Week:</label>
                        <input
                            type="text"
                            name="targetWeek"
                            value={formData.targetWeek}
                            onChange={handleChange}
                        />
                    </div>
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label>Office:</label>
                        <select
                            name="office"
                            value={formData.office}
                            onChange={handleChange}
                            required
                            disabled={loading}
                        >
                            <option value="">Select Office</option>
                            {offices.map((office) => (
                                <option key={office._id} value={office.officeName}>
                                    {office.officeName}
                                </option>
                            ))}
                        </select>
                        {loading && <span>Loading offices...</span>}
                    </div>
                    <div className="form-group">
                        <label>Target Month:</label>
                        <input
                            type="text"
                            name="targetMonth"
                            value={formData.targetMonth}
                            onChange={handleChange}
                        />
                    </div>
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label>Aadhaar Number: <strong>(Apply 12 digits)</strong> </label>
                        <input
                            type="text"
                            name="aadhaarNumber"
                            value={formData.aadhaarNumber}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="form-group">
                        <label>Name:</label>
                        <input
                            type="text"
                            name="userName"
                            value={formData.userName}
                            onChange={handleChange}
                        />
                    </div>
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label>Password: <strong>(Min length 6)</strong> <span className='text-danger'><strong>*</strong></span> </label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="form-group">
                        <label>Role: <span className='text-danger'><strong>*</strong></span></label>
                        <select
                            name="role"
                            value={formData.role}
                            onChange={handleChange}
                            required
                            disabled={rolesLoading}
                        >
                            <option value="">Select Role</option>
                            {roles.map((role) => (
                                <option key={role.value} value={role.value}>
                                    {role.label}
                                </option>
                            ))}
                        </select>
                        {rolesLoading && <span>Loading roles...</span>}
                    </div>
                </div>

                <div className="form-group w-50">
                    <label>User Type: <span className='text-danger'><strong>*</strong></span></label>
                    <select
                        name="userType"
                        value={formData.userType}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Select User Type</option>
                        <option value="all">All</option>
                        <option value="PUC">PUC</option>
                        <option value="TUC">TUC</option>
                    </select>
                </div>
                <div className="form-group">
                    <label>Mobile:</label>
                    <input
                        type="text"
                        name="mobile"
                        value={formData.mobile}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <button type="submit">{user ? 'Update' : 'Create'} User</button>
                    {user && (
                        <button type="button" onClick={handleDelete}>
                            Delete
                        </button>
                    )}
                </div>
            </form>
        </div>
    );
};




// import React, { useState, useEffect, useRef } from 'react';
// import axios from 'axios';
// import { toast, ToastContainer } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import './UserList.css';
// import { FaEdit } from 'react-icons/fa';
// import { MdDeleteForever } from 'react-icons/md';
// import { Table } from 'react-bootstrap';

// const UserForm = ({ user, onSave, onDelete }) => {
//     const [formData, setFormData] = useState({
//         name: '',
//         address: '',
//         office: '',
//         jobType: '',
//         targetWeek: '',
//         targetMonth: '',
//         mobile: '',
//         aadhaarNumber: '',
//         userName: '',
//         password: '',
//         role: '',
//         userType: ''
//     });

//     const [offices, setOffices] = useState([]); // State to store offices
//     const [loading, setLoading] = useState(false);

//     // Fetch offices from API
//     useEffect(() => {
//         const fetchOffices = async () => {
//             try {
//                 setLoading(true);
//                 const response = await axios.get(`${process.env.REACT_APP_API_URL}/office-all-rent`);
//                 setOffices(response.data);
//             } catch (error) {
//                 console.error('Failed to fetch offices:', error);
//                 toast.error('Failed to load offices');
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchOffices();
//     }, []);

//     // Update formData when user prop is passed (for update scenario)
//     useEffect(() => {
//         if (user) {
//             setFormData(user);
//         }
//     }, [user]);

//     // Handle input changes
//     const handleChange = (e) => {
//         const { name, value } = e.target;
//         setFormData((prevState) => ({
//             ...prevState,
//             [name]: value
//         }));
//     };

//     useEffect(() => {
//         if (user && user._id) {
//             axios.get(`${process.env.REACT_APP_API_URL}/admin/${user._id}`)
//                 .then(res => {
//                     const data = res.data;
//                     setFormData({
//                         ...data,
//                         password: data.plainPassword || ''
//                     });
//                 })
//                 .catch(err => console.error('Error fetching user:', err));
//         }
//     }, [user]);

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         try {
//             if (user && user._id) {
//                 await axios.post(`${process.env.REACT_APP_API_URL}/admin-updates/${user._id}`, formData);
//                 alert('User updated successfully!');
//             } else {
//                 await axios.post(`${process.env.REACT_APP_API_URL}/admin-creates`, formData);
//                 alert('User created successfully!');
//             }
//             onSave();
//         } catch (err) {
//             alert('Error saving user');
//             console.error(err);
//         }
//     };

//     // Handle user deletion
//     const handleDelete = async () => {
//         try {
//             if (user && window.confirm('Are you sure you want to delete this user?')) {
//                 await axios.delete(`${process.env.REACT_APP_API_URL}/admin-delete/${user._id}`);
//                 alert('User deleted successfully!');
//                 onDelete();
//             }
//         } catch (err) {
//             alert('An error occurred while deleting!');
//         }
//     };

//     return (
//         <div>
//             <ToastContainer />
//             <h2>{user ? 'Update User' : 'Create User'}</h2>
//             <form onSubmit={handleSubmit}>
//                 <div className="form-row">
//                     <div className="form-group">
//                         <label>User Name: <span className='text-danger'><strong>*</strong></span></label>
//                         <input
//                             type="text"
//                             name="name"
//                             value={formData.name}
//                             onChange={handleChange}
//                             required
//                         />
//                     </div>
//                     <div className="form-group">
//                         <label>Address:</label>
//                         <input
//                             type="text"
//                             name="address"
//                             value={formData.address}
//                             onChange={handleChange}
//                         />
//                     </div>
//                 </div>

//                 <div className="form-row">
//                     <div className="form-group">
//                         <label>Job Type:</label>
//                         <select
//                             name="jobType"
//                             value={formData.jobType}
//                             onChange={handleChange}
//                             required
//                         >
//                             <option value="">Select Job Type</option>
//                             <option value="Full-time">Full-time</option>
//                             <option value="Part-time">Part-time</option>
//                         </select>
//                     </div>
//                     <div className="form-group">
//                         <label>Target Week:</label>
//                         <input
//                             type="text"
//                             name="targetWeek"
//                             value={formData.targetWeek}
//                             onChange={handleChange}
//                         />
//                     </div>
//                 </div>

//                 <div className="form-row">
//                     <div className="form-group">
//                         <label>Office:</label>
//                         <select
//                             name="office"
//                             value={formData.office}
//                             onChange={handleChange}
//                             required
//                             disabled={loading}
//                         >
//                             <option value="">Select Office</option>
//                             {offices.map((office) => (
//                                 <option key={office._id} value={office.officeName}>
//                                     {office.officeName}
//                                 </option>
//                             ))}
//                         </select>
//                         {loading && <span>Loading offices...</span>}
//                     </div>
//                     <div className="form-group">
//                         <label>Target Month:</label>
//                         <input
//                             type="text"
//                             name="targetMonth"
//                             value={formData.targetMonth}
//                             onChange={handleChange}
//                         />
//                     </div>
//                 </div>

//                 <div className="form-row">
//                     <div className="form-group">
//                         <label>Aadhaar Number: <strong>(Apply 12 digits)</strong> </label>
//                         <input
//                             type="text"
//                             name="aadhaarNumber"
//                             value={formData.aadhaarNumber}
//                             onChange={handleChange}
//                         />
//                     </div>
//                     <div className="form-group">
//                         <label>Name:</label>
//                         <input
//                             type="text"
//                             name="userName"
//                             value={formData.userName}
//                             onChange={handleChange}
//                         />
//                     </div>
//                 </div>

//                 <div className="form-row">
//                     <div className="form-group">
//                         <label>Password: <strong>(Min length 6)</strong> <span className='text-danger'><strong>*</strong></span> </label>
//                         <input
//                             type="password"
//                             name="password"
//                             value={formData.password}
//                             onChange={handleChange}
//                         />
//                     </div>

//                     <div className="form-group">
//                         <label>Role: <span className='text-danger'><strong>*</strong></span></label>
//                         <select
//                             name="role"
//                             value={formData.role}
//                             onChange={handleChange}
//                             required
//                         >
//                             <option value="">Select Roll</option>
//                             <option value="manager">Manager</option>
//                             <option value="admin">Admin</option>
//                             <option value="accountant">Accountant</option>
//                         </select>
//                     </div>
//                 </div>

//                 <div className="form-group w-50">
//                     <label>User Type: <span className='text-danger'><strong>*</strong></span></label>
//                     <select
//                         name="userType"
//                         value={formData.userType}
//                         onChange={handleChange}
//                         required
//                     >
//                         <option value="">Select User Type</option>
//                         <option value="all">All</option>
//                         <option value="PUC">PUC</option>
//                         <option value="TUC">TUC</option>
//                     </select>
//                 </div>
//                 <div className="form-group">
//                     <label>Mobile:</label>
//                     <input
//                         type="text"
//                         name="mobile"
//                         value={formData.mobile}
//                         onChange={handleChange}
//                     />
//                 </div>
//                 <div>
//                     <button type="submit">{user ? 'Update' : 'Create'} User</button>
//                     {user && (
//                         <button type="button" onClick={handleDelete}>
//                             Delete
//                         </button>
//                     )}
//                 </div>
//             </form>
//         </div>
//     );
// };





const UserList = () => {
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const tableRef = useRef();
  
  const handlePrint = () => {
    const printContent = tableRef.current.innerHTML;
    const printWindow = window.open("", "", "width=1200,height=800");
    printWindow.document.write(`
      <html>
        <head>
          <title>Print Table</title>
          <style>
            table { border-collapse: collapse; width: 100%; font-size: 12px; }
            th, td { border: 1px solid #000; padding: 6px; text-align: left; }
            th { background: #f0f0f0; }
          </style>
        </head>
        <body>
          <table>${printContent}</table>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };
    // Fetch all users on component mount
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/admin-all`);
                setUsers(response.data);
            } catch (err) {
                alert('Error fetching users!');
            }
        };
        fetchUsers();
    }, []);

    // Handle when user is saved or deleted
    const handleSave = () => {
        setSelectedUser(null);
        // Refetch users after save
        axios.get(`${process.env.REACT_APP_API_URL}/admin-all`).then(response => setUsers(response.data));
    };

    const handleDelete = () => {
        setSelectedUser(null);
        // Refetch users after deletion
        axios.get(`${process.env.REACT_APP_API_URL}/admin-all`).then(response => setUsers(response.data));
    };

    return (
        <div>
            <h1 style={{color:"rgb(47,116,127)"}} className='text-center mb-4'>Staff Management</h1>
            <UserForm user={selectedUser} onSave={handleSave} onDelete={handleDelete} />
            <h2>Staff Details - Edit - Delete</h2>
                          <button className="btn btn-secondary mb-3 mt-2" style={{background:"tomato"}} onClick={handlePrint}>
  Print
</button>
<div ref={tableRef}>
            <Table striped bordered hover responsive className="table-sm align-middle">
            <thead className="sticky-top">
                    <tr>
                        <th>Sl</th>
                        <th>UserName</th>
                        <th>Bycrpt Password</th>
                        <th>Admin Set Password</th>
                        <th>Role</th>
                        <th>UserType</th>
                        <th>Office</th>
                        <th>Mobile Number</th>
                        <th>Edit / Delete</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user, index) => (
                        <tr key={user._id}>
                            <td>{index + 1}</td>
                            <td>{user.name}</td>
                            <td>{user.password}</td>
                            <td>{user.plainPassword}</td>
                            <td>{user.role}</td>
                            <td>{user.userType}</td>
                            <td>{user.office}</td>
                            <td>{user.mobile}</td>
                            <td>
                                <button  className='text-primary' onClick={() => setSelectedUser(user)}><FaEdit /></button>
                                <button  className='text-danger fs-5 ' onClick={async () => {
                                    if (window.confirm('Are you sure?')) {
                                        await axios.delete(`${process.env.REACT_APP_API_URL}/admin-delete/${user._id}`);
                                        toast.success('User deleted successfully!');
                                        setUsers(users.filter(u => u._id !== user._id));
                                    }
                                }}><MdDeleteForever /></button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </div>
        </div>
    );
};

export default UserList;
