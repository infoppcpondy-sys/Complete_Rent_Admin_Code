import React, { useState, useEffect } from "react";
import axios from "axios";

// ── Backend base URL ──────────────────────────────────────────────────────────
// IMPORTANT: Must use absolute URL because App.js uses basename="/process"
// which causes relative URLs like "/PPC/..." to become "/process/PPC/..."
// Set REACT_APP_API_URL in your .env file for production, e.g.:
//   REACT_APP_API_URL=https://yourdomain.com/PPC
const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:5005";

/* ── Send Message Modal ─────────────────────────────────────────────────────── */
const SendMessageModal = ({ onClose, onSent }) => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [message, setMessage]         = useState("");
  const [loading, setLoading]         = useState(false);
  const [error, setError]             = useState("");
  const [success, setSuccess]         = useState("");

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && e.ctrlKey && !loading) handleSend();
  };

  const handleSend = async () => {
    const rawPhone = phoneNumber.trim().replace(/[\s\-()]/g, "");
    if (!rawPhone) return setError("⚠️ Please enter a phone number.");
    if (rawPhone.replace(/\D/g, "").length < 10)
      return setError("⚠️ Phone number must be at least 10 digits.");
    if (!message.trim()) return setError("⚠️ Message cannot be empty.");

    setError("");
    setSuccess("");
    setLoading(true);

    try {
      let formattedNumber = rawPhone;
      if (!formattedNumber.startsWith("+")) {
        if (formattedNumber.startsWith("91") && formattedNumber.length === 12) {
          formattedNumber = "+" + formattedNumber;
        } else {
          formattedNumber = "+91" + formattedNumber.slice(-10);
        }
      }

      console.log("📱 Sending to:", formattedNumber);
      console.log("🌐 Hitting:", `${API_BASE}/send-text`);

      const response = await axios.post(
        `${API_BASE}/send-text`,
        { to: formattedNumber, text: message.trim() },
        { headers: { "Content-Type": "application/json" }, timeout: 20000 }
      );

      console.log("✅ Response:", response.data);
      console.log("✅ Status Code:", response.status);

      // Success if:
      // 1. Backend returns success: true (our format)
      // 2. HTTP status is 200 (message was sent)
      // 3. message_status is "Success" (OneMsg format passed through)
      const isSuccess = 
        response.data?.success === true ||
        response.status === 200 ||
        String(response.data?.message_status).toLowerCase().trim() === "success";

      if (isSuccess) {
        setSuccess("✅ Message sent successfully! Using database credentials.");
        setTimeout(() => { onSent(formattedNumber, message.trim()); onClose(); }, 1500);
      } else {
        setError(`❌ ${response.data?.message || "Failed to send message"}`);
      }
    } catch (err) {
      console.error("❌ Error:", err);
      const msg =
        err.response?.data?.message ||
        err.response?.data?.error   ||
        err.message                 ||
        "Unknown error";
      setError(`❌ Failed to send message: ${msg}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.overlay} onClick={(e) => e.target === e.currentTarget && !loading && onClose()}>
      <div style={styles.modal}>

        {/* Header */}
        <div style={styles.modalHeader}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={styles.waIcon}>
              <svg viewBox="0 0 24 24" width="20" height="20" fill="#fff">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                <path d="M12 0C5.373 0 0 5.373 0 12c0 2.136.562 4.14 1.541 5.877L0 24l6.293-1.519A11.934 11.934 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 01-5.006-1.369l-.36-.214-3.733.901.939-3.626-.235-.373A9.818 9.818 0 1112 21.818z" />
              </svg>
            </div>
            <div>
              <h2 style={styles.modalTitle}>Send WhatsApp Message</h2>
              <p style={styles.modalSub}>Send a message to a single number</p>
            </div>
          </div>
          <button onClick={onClose} style={styles.closeBtn} disabled={loading}>×</button>
        </div>

        {/* Body */}
        <div style={styles.modalBody}>
          <div style={styles.field}>
            <label style={styles.label}>
              Phone Number <span style={{ color: "#e53e3e" }}>*</span>
            </label>
            <input
              type="tel"
              value={phoneNumber}
              onChange={(e) => { setPhoneNumber(e.target.value); setError(""); }}
              placeholder="9876543210 or +91 98765 43210"
              style={styles.input}
              disabled={loading}
            />
            <p style={styles.hint}>10 digits or include +91. Spaces and dashes removed automatically.</p>
          </div>

          <div style={styles.field}>
            <label style={styles.label}>
              Message <span style={{ color: "#e53e3e" }}>*</span>
            </label>
            <textarea
              value={message}
              onChange={(e) => { setMessage(e.target.value); setError(""); }}
              onKeyDown={handleKeyDown}
              placeholder="Type your WhatsApp message here... (Ctrl+Enter to send)"
              rows={6}
              style={styles.textarea}
              disabled={loading}
            />
            <p style={styles.counter}>{message.length} characters</p>
          </div>

          {error   && <div style={styles.errorBox}>{error}</div>}
          {success && <div style={styles.successBox}>{success}</div>}
        </div>

        {/* Footer */}
        <div style={styles.modalFooter}>
          <button onClick={onClose} style={styles.cancelBtn} disabled={loading}>Cancel</button>
          <button onClick={handleSend} style={styles.sendBtn} disabled={loading}>
            {loading ? (
              <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={styles.spinner} /> Sending...
              </span>
            ) : (
              <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                  <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                </svg>
                Send Message
              </span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

/* ── Credentials Modal ───────────────────────────────────────────────────────── */
const CredentialsModal = ({ onClose, onSaved }) => {
  const [apiKey, setApiKey] = useState("");
  const [accessToken, setAccessToken] = useState("");
  const [loading, setLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    fetchCredentials();
    return () => { document.body.style.overflow = ""; };
  }, []);

  const fetchCredentials = async () => {
    try {
      console.log("🔍 Fetching credentials from:", `${API_BASE}/wasender-credentials`);
      const response = await axios.get(
        `${API_BASE}/wasender-credentials`,
        { timeout: 10000 }
      );

      console.log("✅ Credentials response:", response.data);

      if (response.data?.success && response.data?.data) {
        setApiKey(response.data.data.apiKey || "");
        setAccessToken(response.data.data.personalAccessToken || "");
        setError("");
      } else {
        console.warn("⚠️ Unexpected response format:", response.data);
        setError("Failed to load credentials: Invalid response format");
      }
    } catch (err) {
      console.error("❌ Error fetching credentials:", err);
      console.error("Response data:", err.response?.data);
      console.error("Request URL:", err.config?.url);
      const errorMsg = err.response?.data?.message || err.message || "Failed to load credentials";
      setError(`❌ ${errorMsg}`);
    } finally {
      setIsFetching(false);
    }
  };

  const handleSave = async () => {
    if (!apiKey.trim()) return setError("⚠️ API Key is required.");
    if (!accessToken.trim()) return setError("⚠️ Personal Access Token is required.");

    setError("");
    setSuccess("");
    setLoading(true);

    try {
      console.log("💾 Saving credentials to database at:", `${API_BASE}/wasender-credentials`);
      const response = await axios.post(
        `${API_BASE}/wasender-credentials`,
        {
          apiKey: apiKey.trim(),
          personalAccessToken: accessToken.trim(),
          webhookSecret: ""
        },
        { headers: { "Content-Type": "application/json" }, timeout: 15000 }
      );

      console.log("✅ Save response:", response.data);

      if (response.data?.success) {
        setSuccess("✅ Credentials saved to database! All future messages will use these credentials.");
        setIsEditing(false);
        setTimeout(() => { onSaved(); onClose(); }, 1500);
      } else {
        setError(`❌ ${response.data?.message || "Failed to save credentials"}`);
      }
    } catch (err) {
      console.error("❌ Error saving credentials:", err);
      console.error("Response data:", err.response?.data);
      console.error("Request URL:", err.config?.url);
      const msg = err.response?.data?.message || err.message || "Failed to save credentials";
      setError(`❌ ${msg}`);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && e.ctrlKey && !loading) handleSave();
  };

  return (
    <div style={styles.overlay} onClick={(e) => e.target === e.currentTarget && !loading && onClose()}>
      <div style={styles.modal}>
        <div style={styles.modalHeader}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={styles.credIcon}>
              <svg viewBox="0 0 24 24" width="20" height="20" fill="#fff">
                <path d="M18 8h-1V6c0-2.76-2.24-5-5-5s-5 2.24-5 5v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zM9 6c0-1.66 1.34-3 3-3s3 1.34 3 3v2H9V6zm9 14H6V10h12v10zm-6-3c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2z" />
              </svg>
            </div>
            <div>
              <h2 style={styles.modalTitle}>Wasender API Credentials</h2>
              <p style={styles.modalSub}>Manage your API keys and tokens</p>
            </div>
          </div>
          <button onClick={onClose} style={styles.closeBtn} disabled={loading}>×</button>
        </div>

        <div style={styles.modalBody}>
          {isFetching ? (
            <div style={{ padding: "40px 20px", textAlign: "center" }}>
              <div style={styles.spinner} />
              <p style={{ color: "#718096", marginTop: 12 }}>Loading credentials...</p>
            </div>
          ) : !isEditing ? (
            <>
              <div style={styles.credentialDisplay}>
                <div style={styles.credField}>
                  <label style={styles.credLabel}>API Key</label>
                  <div style={styles.credValue}>
                    {apiKey ? "••••••••" + apiKey.slice(-4) : "Not set"}
                  </div>
                </div>
                <div style={styles.credField}>
                  <label style={styles.credLabel}>Personal Access Token</label>
                  <div style={styles.credValue}>
                    {accessToken ? "••••••••" + accessToken.slice(-4) : "Not set"}
                  </div>
                </div>
              </div>
              {error && <div style={styles.errorBox}>{error}</div>}
              {success && <div style={styles.successBox}>{success}</div>}
            </>
          ) : (
            <>
              <div style={styles.field}>
                <label style={styles.label}>
                  API Key <span style={{ color: "#e53e3e" }}>*</span>
                </label>
                <input
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="Enter your Wasender API Key"
                  style={styles.input}
                  disabled={loading}
                />
                <p style={styles.hint}>Your API key for Wasender service</p>
              </div>

              <div style={styles.field}>
                <label style={styles.label}>
                  Personal Access Token <span style={{ color: "#e53e3e" }}>*</span>
                </label>
                <input
                  type="password"
                  value={accessToken}
                  onChange={(e) => setAccessToken(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Enter your Personal Access Token"
                  style={styles.input}
                  disabled={loading}
                />
                <p style={styles.hint}>Your personal access token for authentication</p>
              </div>

              {error && <div style={styles.errorBox}>{error}</div>}
              {success && <div style={styles.successBox}>{success}</div>}
            </>
          )}
        </div>

        <div style={styles.modalFooter}>
          <button onClick={onClose} style={styles.cancelBtn} disabled={loading || isFetching}>
            {isEditing ? "Cancel" : "Close"}
          </button>
          {!isEditing ? (
            <button onClick={() => { setIsEditing(true); setError(""); }} style={styles.editBtn} disabled={loading || isFetching}>
              ✏️ Edit Credentials
            </button>
          ) : (
            <button onClick={handleSave} style={styles.sendBtn} disabled={loading}>
              {loading ? (
                <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={styles.spinner} /> Saving...
                </span>
              ) : (
                "Save Credentials"
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

/* ── Login Form ──────────────────────────────────────────────────────────────── */
const LoginForm = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (!username.trim()) {
      return setError("⚠️ Please enter username.");
    }
    if (!password.trim()) {
      return setError("⚠️ Please enter password.");
    }

    setLoading(true);

    // Simulate API call delay
    setTimeout(() => {
      if (username === "admin" && password === "admin") {
        localStorage.setItem("pmAuthenticated", "true");
        localStorage.setItem("pmUsername", username);
        localStorage.setItem("pmEmail", username + "@rentpondy.com");
        onLoginSuccess();
        setLoading(false);
      } else {
        setError("❌ Invalid username or password.");
        setLoading(false);
      }
    }, 800);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !loading) handleLogin(e);
  };

  return (
    <div style={styles.loginContainer}>
      <div style={styles.loginBox}>
        <div style={styles.loginHeader}>
          <div style={{ fontSize: 48, marginBottom: 16 }}></div>
          <h2 style={styles.loginTitle}>PONDY MATRIMONY</h2>
          <p style={styles.loginSubtitle}>WhatsApp Campaign Manager single message</p>
        </div>

        <form onSubmit={handleLogin} style={{ width: "100%" }}>
          <div style={styles.formGroup}>
            <label style={styles.formLabel}>Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => { setUsername(e.target.value); setError(""); }}
              onKeyDown={handleKeyDown}
              placeholder="Enter username"
              style={styles.formControl}
              disabled={loading}
              autoFocus
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.formLabel}>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => { setPassword(e.target.value); setError(""); }}
              onKeyDown={handleKeyDown}
              placeholder="Enter password"
              style={styles.formControl}
              disabled={loading}
            />
          </div>

          {error && <div style={styles.loginErrorBox}>{error}</div>}

          <button
            type="submit"
            style={styles.loginBtn}
            disabled={loading}
            onClick={handleLogin}
          >
            {loading ? (
              <span style={{ display: "flex", alignItems: "center", gap: 8, justifyContent: "center" }}>
                <span style={styles.spinner} /> Logging in...
              </span>
            ) : (
              "Login"
            )}
          </button>

          <div style={styles.credentialHint}>
            <p style={{ margin: 0, fontSize: 12, color: "#718096" }}>
              <strong>Demo Credentials:</strong><br />
              Username: <code style={{ background: "#f0f0f0", padding: "2px 6px", borderRadius: 4 }}>admin</code><br />
              Password: <code style={{ background: "#f0f0f0", padding: "2px 6px", borderRadius: 4 }}>admin</code>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

/* ── Main Page ───────────────────────────────────────────────────────────────── */
const PMLogin = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showModal, setShowModal]             = useState(false);
  const [showCredsModal, setShowCredsModal]   = useState(false);
  const [toast, setToast]                     = useState("");
  const [sentMessages, setSentMessages]       = useState([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);

  // Fetch message history from backend
  const fetchMessageHistory = async () => {
    try {
      setIsLoadingHistory(true);
      console.log("📥 Fetching message history from:", `${API_BASE}/pm-history`);
      const response = await axios.get(`${API_BASE}/pm-history?limit=100`, {
        timeout: 15000
      });

      if (response.data?.success && response.data?.data) {
        // Convert backend data to display format
        const formattedMessages = response.data.data.map((msg, index) => ({
          id: index,
          phoneNumber: msg.phoneNumber || "",
          message: msg.message || "",
          sendTime: msg.sentAt ? new Date(msg.sentAt).toLocaleString('en-IN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: true
          }) : "N/A"
        }));
        console.log("✅ Loaded", formattedMessages.length, "messages from history");
        setSentMessages(formattedMessages);
      }
    } catch (err) {
      console.error("⚠️ Error fetching message history:", err.message);
      // Try to load from localStorage as fallback
      const cached = localStorage.getItem("pmMessageHistory");
      if (cached) {
        try {
          setSentMessages(JSON.parse(cached));
          console.log("📦 Loaded messages from localStorage cache");
        } catch (e) {
          console.error("Failed to parse cached messages");
        }
      }
    } finally {
      setIsLoadingHistory(false);
    }
  };

  useEffect(() => {
    // Clear authentication on page load/reload - always show login
    localStorage.removeItem("pmAuthenticated");
    localStorage.removeItem("pmUsername");
    setIsAuthenticated(false);
  }, []);

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
    // Fetch message history after login
    fetchMessageHistory();
  };

  const handleLogout = () => {
    localStorage.removeItem("pmAuthenticated");
    localStorage.removeItem("pmUsername");
    setIsAuthenticated(false);
    setShowModal(false);
    setShowCredsModal(false);
    // Keep messages in state - don't clear them
    setToast("✓ Logged out successfully!");
    setTimeout(() => setToast(""), 3500);
  };

  const handleSent = (phoneNumber, message) => {
    const currentTime = new Date();
    const formattedTime = currentTime.toLocaleString('en-IN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    });

    const newMessage = {
      id: Date.now(), // Use timestamp as unique ID
      phoneNumber,
      message,
      sendTime: formattedTime
    };

    // Add to state
    setSentMessages((prevMessages) => {
      const updatedMessages = [newMessage, ...prevMessages];
      // Cache to localStorage as fallback
      localStorage.setItem("pmMessageHistory", JSON.stringify(updatedMessages));
      return updatedMessages;
    });

    setToast("✓ Message sent successfully!");
    setTimeout(() => setToast(""), 3500);
  };

  const handleCredentialsSaved = () => {
    setToast("✓ Credentials updated successfully!");
    setTimeout(() => setToast(""), 3500);
  };

  if (!isAuthenticated) {
    return <LoginForm onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div style={styles.page}>
      {toast && <div style={styles.toast}>{toast}</div>}

      <div style={styles.pageHeader}>
        <div>
          <h1 style={styles.pageTitle}>
            <span style={styles.waDot} />
            Send WhatsApp Message
          </h1>
          <p style={styles.pageDesc}>Send a quick message to a single WhatsApp number</p>
        </div>
        <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
          <button onClick={() => setShowModal(true)} style={styles.createBtn}>
            <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" style={{ marginRight: 8 }}>
              <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
            </svg>
            Send Message
          </button>
          <button onClick={() => setShowCredsModal(true)} style={styles.credsBtn}>
            🔐 API Credentials
          </button>
          <button onClick={handleLogout} style={styles.logoutBtn}>
            Logout
          </button>
        </div>
      </div>

      <div style={styles.infoCard}>
        <div style={{ display: "flex", gap: 12 }}>
          <div style={{ fontSize: 24 }}>💬</div>
          <div>
            <h3 style={{ margin: "0 0 6px", fontSize: 14, fontWeight: 600, color: "#1a202c" }}>
              Quick Message Sender
            </h3>
            <p style={{ margin: 0, fontSize: 13, color: "#718096", lineHeight: 1.5 }}>
              Enter a phone number and compose your message. Click "Send Message" to deliver via WhatsApp.
            </p>
          </div>
        </div>
      </div>

      {/* Messages Table */}
      <div style={styles.tableContainer}>
        <h2 style={styles.tableTitle}>
          <span style={{ fontSize: 20, marginRight: 8 }}>📋</span>
          Sent Messages ({sentMessages.length})
        </h2>
        {isLoadingHistory ? (
          <div style={styles.noDataMessage}>
            <div style={styles.spinner} />
            <p style={{ margin: "12px 0 0", color: "#718096", fontSize: 13 }}>
              Loading message history...
            </p>
          </div>
        ) : sentMessages.length === 0 ? (
          <div style={styles.noDataMessage}>
            <p style={{ margin: 0, color: "#718096", fontSize: 13 }}>
              No messages sent yet. Click "Send Message" to get started!
            </p>
          </div>
        ) : (
          <div style={styles.tableWrapper}>
            <table style={styles.table}>
              <thead>
                <tr style={styles.tableHeader}>
                  <th style={{ ...styles.tableCell, width: "8%", textAlign: "center" }}>SI.No</th>
                  <th style={{ ...styles.tableCell, width: "20%", textAlign: "left" }}>Phone Number</th>
                  <th style={{ ...styles.tableCell, width: "50%", textAlign: "left" }}>Message Content</th>
                  <th style={{ ...styles.tableCell, width: "22%", textAlign: "center" }}>Send Time</th>
                </tr>
              </thead>
              <tbody>
                {sentMessages.map((msg, index) => (
                  <tr key={msg.id} style={index % 2 === 0 ? styles.tableRowEven : styles.tableRowOdd}>
                    <td style={{ ...styles.tableCell, width: "8%", textAlign: "center", fontWeight: 600, color: "#667eea" }}>
                      {index + 1}
                    </td>
                    <td style={{ ...styles.tableCell, width: "20%", textAlign: "left", color: "#1a202c", fontWeight: 500 }}>
                      {msg.phoneNumber}
                    </td>
                    <td style={{ ...styles.tableCell, width: "50%", textAlign: "left", color: "#4a5568", wordBreak: "break-word" }}>
                      {msg.message}
                    </td>
                    <td style={{ ...styles.tableCell, width: "22%", textAlign: "center", color: "#718096", fontSize: 12 }}>
                      {msg.sendTime}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showModal && (
        <SendMessageModal onClose={() => setShowModal(false)} onSent={handleSent} />
      )}

      {showCredsModal && (
        <CredentialsModal onClose={() => setShowCredsModal(false)} onSaved={handleCredentialsSaved} />
      )}
    </div>
  );
};

/* ── Styles ──────────────────────────────────────────────────────────────────── */
const styles = {
  loginContainer: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "'Segoe UI', system-ui, sans-serif",
    padding: "20px",
  },
  loginBox: {
    background: "#fff",
    borderRadius: 16,
    boxShadow: "0 15px 50px rgba(0, 0, 0, 0.3)",
    padding: "50px",
    width: "100%",
    maxWidth: 420,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    animation: "slideIn 0.5s ease-out",
  },
  loginHeader: {
    textAlign: "center",
    marginBottom: 30,
  },
  loginTitle: {
    color: "#667eea",
    fontWeight: 800,
    marginBottom: 6,
    fontSize: 28,
    letterSpacing: "-0.5px",
    margin: 0,
  },
  loginSubtitle: {
    color: "#999",
    fontSize: 13,
    margin: "8px 0 0",
    fontWeight: 500,
    letterSpacing: "0.5px",
  },
  formGroup: {
    marginBottom: 18,
    width: "100%",
  },
  formLabel: {
    color: "#333",
    fontWeight: 700,
    marginBottom: 8,
    fontSize: 12,
    textTransform: "uppercase",
    letterSpacing: "0.5px",
    display: "block",
  },
  formControl: {
    width: "100%",
    boxSizing: "border-box",
    border: "2px solid #e8e8e8",
    borderRadius: 8,
    padding: "12px 14px",
    fontSize: 14,
    transition: "all 0.3s ease",
    background: "#f9f9f9",
    color: "#333",
    outline: "none",
    fontFamily: "inherit",
  },
  loginErrorBox: {
    background: "#fff5f5",
    border: "1px solid #fed7d7",
    borderRadius: 8,
    padding: "10px 14px",
    color: "#c53030",
    fontSize: 13,
    marginBottom: 16,
  },
  loginBtn: {
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    border: "none",
    padding: "12px 20px",
    fontWeight: 700,
    fontSize: 14,
    borderRadius: 8,
    transition: "all 0.3s ease",
    marginTop: 8,
    marginBottom: 16,
    textTransform: "uppercase",
    letterSpacing: "0.5px",
    color: "#fff",
    width: "100%",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  credentialHint: {
    textAlign: "center",
    padding: "14px",
    background: "#f0f4ff",
    borderRadius: 8,
    border: "1px solid #dde4ff",
    marginTop: 12,
  },
  page: {
    minHeight: "100vh", background: "#f7f9fc", padding: "28px 32px",
    fontFamily: "'Segoe UI', system-ui, sans-serif", position: "relative",
  },
  pageHeader: {
    display: "flex", justifyContent: "space-between", alignItems: "flex-start",
    marginBottom: 28, flexWrap: "wrap", gap: 16,
  },
  pageTitle: {
    fontSize: 22, fontWeight: 700, color: "#1a202c", margin: 0,
    display: "flex", alignItems: "center", gap: 10,
  },
  waDot: { width: 10, height: 10, borderRadius: "50%", background: "#25d366", display: "inline-block" },
  pageDesc: { fontSize: 13.5, color: "#718096", margin: "4px 0 0" },
  createBtn: {
    display: "flex", alignItems: "center",
    background: "linear-gradient(135deg,#25d366,#128c7e)",
    color: "#fff", border: "none", borderRadius: 10, padding: "10px 20px",
    fontSize: 13.5, fontWeight: 600, cursor: "pointer",
    boxShadow: "0 4px 14px rgba(37,211,102,.35)",
  },
  credsBtn: {
    display: "flex", alignItems: "center",
    background: "linear-gradient(135deg,#667eea,#764ba2)",
    color: "#fff", border: "none", borderRadius: 10, padding: "10px 20px",
    fontSize: 13.5, fontWeight: 600, cursor: "pointer",
    boxShadow: "0 4px 14px rgba(102,126,234,.35)",
    transition: "all 0.3s ease",
  },
  logoutBtn: {
    display: "flex", alignItems: "center",
    background: "#ef4444",
    color: "#fff", border: "none", borderRadius: 10, padding: "10px 20px",
    fontSize: 13.5, fontWeight: 600, cursor: "pointer",
    boxShadow: "0 4px 14px rgba(239, 68, 68, .35)",
    transition: "all 0.3s ease",
  },
  infoCard: {
    background: "#fff", borderRadius: 14,
    boxShadow: "0 1px 4px rgba(0,0,0,.08), 0 4px 16px rgba(0,0,0,.04)",
    padding: "20px", marginBottom: 28, border: "1px solid rgba(37,211,102,.15)",
  },
  overlay: {
    position: "fixed", inset: 0, background: "rgba(0,0,0,.45)",
    backdropFilter: "blur(3px)", display: "flex", alignItems: "center",
    justifyContent: "center", zIndex: 1050, padding: 16,
  },
  modal: {
    background: "#fff", borderRadius: 16, width: "100%", maxWidth: 560,
    boxShadow: "0 20px 60px rgba(0,0,0,.2)", display: "flex",
    flexDirection: "column", maxHeight: "92vh", overflow: "hidden",
  },
  modalHeader: {
    display: "flex", alignItems: "center", justifyContent: "space-between",
    padding: "18px 22px 14px", borderBottom: "1px solid #f0f0f0",
  },
  waIcon: {
    width: 40, height: 40, borderRadius: 12,
    background: "linear-gradient(135deg,#25d366,#128c7e)",
    display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
  },
  credIcon: {
    width: 40, height: 40, borderRadius: 12,
    background: "linear-gradient(135deg,#667eea,#764ba2)",
    display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
  },
  modalTitle: { fontSize: 16, fontWeight: 700, color: "#1a202c", margin: 0 },
  modalSub:   { fontSize: 12, color: "#a0aec0", margin: "2px 0 0" },
  closeBtn: {
    background: "#f4f4f4", border: "none", borderRadius: 8,
    width: 32, height: 32, fontSize: 20, cursor: "pointer", color: "#666",
    display: "flex", alignItems: "center", justifyContent: "center",
  },
  modalBody: { padding: "18px 22px", overflowY: "auto", flex: 1 },
  field:  { marginBottom: 18 },
  label:  { display: "block", fontSize: 13, fontWeight: 600, color: "#2d3748", marginBottom: 7 },
  hint:   { fontSize: 11.5, color: "#a0aec0", margin: "5px 0 0" },
  credentialDisplay: {
    padding: "14px", background: "#f7f9fc", borderRadius: 8,
    border: "1px solid #e2e8f0", marginBottom: 16,
  },
  credField: { marginBottom: 14 },
  credLabel: { display: "block", fontSize: 12, fontWeight: 600, color: "#2d3748", marginBottom: 6 },
  credValue: {
    padding: "8px 12px", background: "#fff", borderRadius: 6,
    border: "1px solid #e2e8f0", color: "#667eea", fontSize: 13,
    fontFamily: "monospace", wordBreak: "break-all",
  },
  input: {
    width: "100%", padding: "9px 13px", borderRadius: 8,
    border: "1.5px solid #e2e8f0", fontSize: 13.5, outline: "none",
    boxSizing: "border-box", color: "#1a202c", fontFamily: "inherit",
  },
  textarea: {
    width: "100%", padding: "10px 13px", borderRadius: 8,
    border: "1.5px solid #e2e8f0", fontSize: 13.5, outline: "none",
    resize: "vertical", boxSizing: "border-box", fontFamily: "inherit",
    color: "#1a202c", lineHeight: 1.4,
  },
  counter:    { fontSize: 11.5, color: "#a0aec0", margin: "5px 0 0", textAlign: "right" },
  errorBox:   {
    background: "#fff5f5", border: "1px solid #fed7d7", borderRadius: 8,
    padding: "10px 14px", color: "#c53030", fontSize: 13, marginTop: 4,
  },
  successBox: {
    background: "#f0fdf4", border: "1px solid #dcfce7", borderRadius: 8,
    padding: "10px 14px", color: "#15803d", fontSize: 13, marginTop: 4,
  },
  modalFooter: {
    display: "flex", gap: 10, justifyContent: "flex-end",
    padding: "14px 22px", borderTop: "1px solid #f0f0f0",
  },
  cancelBtn: {
    padding: "9px 20px", borderRadius: 8, border: "1.5px solid #e2e8f0",
    background: "#fff", color: "#4a5568", fontSize: 13.5, fontWeight: 600,
    cursor: "pointer", fontFamily: "inherit",
  },
  sendBtn: {
    padding: "9px 22px", borderRadius: 8, border: "none",
    background: "linear-gradient(135deg,#25d366,#128c7e)",
    color: "#fff", fontSize: 13.5, fontWeight: 600, cursor: "pointer",
    display: "flex", alignItems: "center", fontFamily: "inherit",
    boxShadow: "0 4px 12px rgba(37,211,102,.3)",
  },
  editBtn: {
    padding: "9px 22px", borderRadius: 8, border: "none",
    background: "linear-gradient(135deg,#667eea,#764ba2)",
    color: "#fff", fontSize: 13.5, fontWeight: 600, cursor: "pointer",
    display: "flex", alignItems: "center", fontFamily: "inherit",
    boxShadow: "0 4px 12px rgba(102,126,234,.3)",
  },
  spinner: {
    width: 14, height: 14, border: "2px solid rgba(255,255,255,.4)",
    borderTopColor: "#fff", borderRadius: "50%", display: "inline-block",
    animation: "spin .7s linear infinite",
  },
  toast: {
    position: "fixed", top: 20, right: 24, background: "#1a7a3c",
    color: "#fff", padding: "12px 20px", borderRadius: 10,
    fontSize: 13.5, fontWeight: 500, boxShadow: "0 6px 20px rgba(0,0,0,.15)",
    zIndex: 2000, animation: "fadeIn .3s ease",
  },
  tableContainer: {
    background: "#fff", borderRadius: 14,
    boxShadow: "0 1px 4px rgba(0,0,0,.08), 0 4px 16px rgba(0,0,0,.04)",
    padding: "20px", marginTop: 28, border: "1px solid rgba(37,211,102,.15)",
  },
  tableTitle: {
    fontSize: 16, fontWeight: 700, color: "#1a202c", margin: "0 0 16px 0",
    display: "flex", alignItems: "center",
  },
  noDataMessage: {
    padding: "40px 20px", textAlign: "center",
    background: "#f7f9fc", borderRadius: 8, border: "1px dashed #cbd5e0",
  },
  tableWrapper: {
    overflowX: "auto", borderRadius: 8, border: "1px solid #e2e8f0",
  },
  table: {
    width: "100%", borderCollapse: "collapse", fontSize: 13,
  },
  tableHeader: {
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    color: "#fff",
  },
  tableCell: {
    padding: "12px 14px", borderBottom: "1px solid #e2e8f0",
  },
  tableRowEven: {
    background: "#fff",
  },
  tableRowOdd: {
    background: "#f7f9fc",
  },
};

if (typeof document !== "undefined" && !document.getElementById("rp-wa-anim")) {
  const s = document.createElement("style");
  s.id = "rp-wa-anim";
  s.textContent = `
    @keyframes spin   { to { transform: rotate(360deg); } }
    @keyframes fadeIn { from { opacity:0; transform:translateY(-8px); } to { opacity:1; transform:translateY(0); } }
  `;
  document.head.appendChild(s);
}

export default PMLogin;