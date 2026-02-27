import React, { useState, useEffect } from "react";
import axios from "axios";

/* ── modal for sending single message ──────────────────────────────────────── */
const SendMessageModal = ({ onClose, onSent }) => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [message, setMessage]         = useState("");
  const [loading, setLoading]         = useState(false);
  const [error, setError]             = useState("");
  const [success, setSuccess]         = useState("");

  const handleSend = async () => {
    // Validation
    if (!phoneNumber.trim()) {
      return setError("⚠️ Please enter a phone number.");
    }
    
    if (phoneNumber.length < 10) {
      return setError("⚠️ Phone number must be at least 10 digits.");
    }
    
    if (!message.trim()) {
      return setError("⚠️ Message cannot be empty.");
    }

    setError("");
    setSuccess("");
    setLoading(true);

    try {
      // Format phone number: add +91 if not present and remove any spaces/dashes
      let formattedNumber = phoneNumber.trim().replace(/\s|-/g, "");
      
      // Add country code +91 if not already present
      if (!formattedNumber.startsWith("+")) {
        formattedNumber = "+91" + formattedNumber.slice(-10);
      }

      console.log("Sending message to:", formattedNumber);
      console.log("API URL:", process.env.REACT_APP_API_URL);

      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/send-message`,
        {
          to: formattedNumber,
          message: message.trim(),
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Message sent successfully:", response.data);
      setSuccess("✅ Message sent successfully!");
      setTimeout(() => {
        onSent();
        onClose();
      }, 1500);
    } catch (err) {
      console.error("Error sending message:", err);
      const errorMsg = err.response?.data?.error || err.message || "Unknown error";
      setError(`❌ Failed to send message: ${errorMsg}`);
    } finally {
      setLoading(false);
    }
  };

  /* lock body scroll */
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && e.ctrlKey && !loading) {
      handleSend();
    }
  };

  return (
    <div style={styles.overlay} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div style={styles.modal}>

        {/* header */}
        <div style={styles.modalHeader}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={styles.waIcon}>
              <svg viewBox="0 0 24 24" width="20" height="20" fill="#fff">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                <path d="M12 0C5.373 0 0 5.373 0 12c0 2.136.562 4.14 1.541 5.877L0 24l6.293-1.519A11.934 11.934 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 01-5.006-1.369l-.36-.214-3.733.901.939-3.626-.235-.373A9.818 9.818 0 1112 21.818z"/>
              </svg>
            </div>
            <div>
              <h2 style={styles.modalTitle}>Send WhatsApp Message</h2>
              <p style={styles.modalSub}>Send a message to a single number</p>
            </div>
          </div>
          <button onClick={onClose} style={styles.closeBtn} disabled={loading}>×</button>
        </div>

        {/* body */}
        <div style={styles.modalBody}>

          {/* Phone Number */}
          <div style={styles.field}>
            <label style={styles.label}>Phone Number <span style={{ color: "#e53e3e" }}>*</span></label>
            <input
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value.replace(/[^\d+]/g, ""))}
              placeholder="Enter phone number (e.g., 9876543210 or +91 98765 43210)"
              style={styles.input}
              disabled={loading}
            />
            <p style={styles.hint}>Include country code +91 or just 10 digits. Spaces and dashes will be removed.</p>
          </div>

          {/* Message */}
          <div style={styles.field}>
            <label style={styles.label}>Message <span style={{ color: "#e53e3e" }}>*</span></label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your WhatsApp message here... (Ctrl+Enter to send)"
              rows={6}
              style={styles.textarea}
              disabled={loading}
            />
            <p style={styles.counter}>{message.length} characters</p>
          </div>

          {error && (
            <div style={styles.errorBox}>
              <span>⚠ {error}</span>
            </div>
          )}

          {success && (
            <div style={styles.successBox}>
              <span>{success}</span>
            </div>
          )}
        </div>

        {/* footer */}
        <div style={styles.modalFooter}>
          <button onClick={onClose} style={styles.cancelBtn} disabled={loading}>
            Cancel
          </button>
          <button onClick={handleSend} style={styles.sendBtn} disabled={loading}>
            {loading ? (
              <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={styles.spinner} /> Sending...
              </span>
            ) : (
              <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347zM12 0C5.373 0 0 5.373 0 12c0 2.136.562 4.14 1.541 5.877L0 24l6.293-1.519A11.934 11.934 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 01-5.006-1.369l-.36-.214-3.733.901.939-3.626-.235-.373A9.818 9.818 0 1112 21.818z"/>
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

/* ── main page ───────────────────────────────────────────────────────────── */
const SingleSendMessage = () => {
  const [showModal, setShowModal] = useState(false);
  const [toast, setToast]         = useState("");

  const handleSent = () => {
    setToast("✓ Your message has been sent successfully!");
    setTimeout(() => setToast(""), 3500);
  };

  return (
    <div style={styles.page}>

      {/* toast */}
      {toast && <div style={styles.toast}>{toast}</div>}

      {/* page header */}
      <div style={styles.pageHeader}>
        <div>
          <h1 style={styles.pageTitle}>
            <span style={styles.waDot} />
            Send WhatsApp Message
          </h1>
          <p style={styles.pageDesc}>Send a quick message to a single WhatsApp number</p>
        </div>
        <button onClick={() => setShowModal(true)} style={styles.createBtn}>
          <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" style={{ marginRight: 8 }}>
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347zM12 0C5.373 0 0 5.373 0 12c0 2.136.562 4.14 1.541 5.877L0 24l6.293-1.519A11.934 11.934 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 01-5.006-1.369l-.36-.214-3.733.901.939-3.626-.235-.373A9.818 9.818 0 1112 21.818z" fill="currentColor"/>
          </svg>
          Send Message
        </button>
      </div>

      {/* info card */}
      <div style={styles.infoCard}>
        <div style={{ display: "flex", gap: 12 }}>
          <div style={{ fontSize: 24 }}>💬</div>
          <div>
            <h3 style={{ margin: "0 0 6px", fontSize: 14, fontWeight: 600, color: "#1a202c" }}>
              Quick Message Sender
            </h3>
            <p style={{ margin: 0, fontSize: 13, color: "#718096", lineHeight: 1.5 }}>
              Enter a phone number and compose your message. Click "Send Message" button to deliver it via WhatsApp. Simple and straightforward!
            </p>
          </div>
        </div>
      </div>

      {showModal && (
        <SendMessageModal onClose={() => setShowModal(false)} onSent={handleSent} />
      )}
    </div>
  );
};

/* ── styles ──────────────────────────────────────────────────────────────── */
const styles = {
  page: {
    minHeight: "100vh",
    background: "#f7f9fc",
    padding: "28px 32px",
    fontFamily: "'Segoe UI', system-ui, sans-serif",
    position: "relative",
  },
  pageHeader: {
    display: "flex", justifyContent: "space-between", alignItems: "flex-start",
    marginBottom: 28, flexWrap: "wrap", gap: 16,
  },
  pageTitle: {
    fontSize: 22, fontWeight: 700, color: "#1a202c",
    margin: 0, display: "flex", alignItems: "center", gap: 10,
  },
  waDot: {
    width: 10, height: 10, borderRadius: "50%",
    background: "#25d366", display: "inline-block",
  },
  pageDesc: { fontSize: 13.5, color: "#718096", margin: "4px 0 0" },
  createBtn: {
    display: "flex", alignItems: "center",
    background: "linear-gradient(135deg,#25d366,#128c7e)",
    color: "#fff", border: "none", borderRadius: 10,
    padding: "10px 20px", fontSize: 13.5, fontWeight: 600,
    cursor: "pointer", boxShadow: "0 4px 14px rgba(37,211,102,.35)",
    transition: "transform .15s, box-shadow .15s",
  },
  infoCard: {
    background: "#fff", borderRadius: 14,
    boxShadow: "0 1px 4px rgba(0,0,0,.08), 0 4px 16px rgba(0,0,0,.04)",
    padding: "20px", marginBottom: 28,
    border: "1px solid rgba(37,211,102,.15)",
  },
  /* modal */
  overlay: {
    position: "fixed", inset: 0,
    background: "rgba(0,0,0,.45)", backdropFilter: "blur(3px)",
    display: "flex", alignItems: "center", justifyContent: "center",
    zIndex: 1050, padding: 16,
  },
  modal: {
    background: "#fff", borderRadius: 16, width: "100%", maxWidth: 560,
    boxShadow: "0 20px 60px rgba(0,0,0,.2)",
    display: "flex", flexDirection: "column",
    maxHeight: "92vh", overflow: "hidden",
  },
  modalHeader: {
    display: "flex", alignItems: "center", justifyContent: "space-between",
    padding: "18px 22px 14px",
    borderBottom: "1px solid #f0f0f0",
  },
  waIcon: {
    width: 40, height: 40, borderRadius: 12,
    background: "linear-gradient(135deg,#25d366,#128c7e)",
    display: "flex", alignItems: "center", justifyContent: "center",
    flexShrink: 0,
  },
  modalTitle: { fontSize: 16, fontWeight: 700, color: "#1a202c", margin: 0 },
  modalSub: { fontSize: 12, color: "#a0aec0", margin: "2px 0 0" },
  closeBtn: {
    background: "#f4f4f4", border: "none", borderRadius: 8,
    width: 32, height: 32, fontSize: 20, cursor: "pointer",
    color: "#666", display: "flex", alignItems: "center", justifyContent: "center",
    lineHeight: 1,
  },
  modalBody: { padding: "18px 22px", overflowY: "auto", flex: 1 },
  field: { marginBottom: 18 },
  label: { display: "block", fontSize: 13, fontWeight: 600, color: "#2d3748", marginBottom: 7 },
  hint: { fontSize: 11.5, color: "#a0aec0", margin: "5px 0 0" },
  input: {
    width: "100%", padding: "9px 13px", borderRadius: 8,
    border: "1.5px solid #e2e8f0", fontSize: 13.5,
    outline: "none", boxSizing: "border-box", color: "#1a202c",
    transition: "border-color .15s",
    fontFamily: "inherit",
  },
  counter: { fontSize: 11.5, color: "#a0aec0", margin: "5px 0 0", textAlign: "right" },
  textarea: {
    width: "100%", padding: "10px 13px", borderRadius: 8,
    border: "1.5px solid #e2e8f0", fontSize: 13.5,
    outline: "none", resize: "vertical", boxSizing: "border-box",
    fontFamily: "inherit", color: "#1a202c", lineHeight: 1.4,
  },
  errorBox: {
    background: "#fff5f5", border: "1px solid #fed7d7",
    borderRadius: 8, padding: "10px 14px", color: "#c53030",
    fontSize: 13, marginTop: 4,
  },
  successBox: {
    background: "#f0fdf4", border: "1px solid #dcfce7",
    borderRadius: 8, padding: "10px 14px", color: "#15803d",
    fontSize: 13, marginTop: 4,
  },
  modalFooter: {
    display: "flex", gap: 10, justifyContent: "flex-end",
    padding: "14px 22px", borderTop: "1px solid #f0f0f0",
  },
  cancelBtn: {
    padding: "9px 20px", borderRadius: 8, border: "1.5px solid #e2e8f0",
    background: "#fff", color: "#4a5568", fontSize: 13.5,
    fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
  },
  sendBtn: {
    padding: "9px 22px", borderRadius: 8, border: "none",
    background: "linear-gradient(135deg,#25d366,#128c7e)",
    color: "#fff", fontSize: 13.5, fontWeight: 600,
    cursor: "pointer", display: "flex", alignItems: "center",
    fontFamily: "inherit",
    boxShadow: "0 4px 12px rgba(37,211,102,.3)",
  },
  spinner: {
    width: 14, height: 14, border: "2px solid rgba(255,255,255,.4)",
    borderTopColor: "#fff", borderRadius: "50%",
    display: "inline-block",
    animation: "spin .7s linear infinite",
  },
  toast: {
    position: "fixed", top: 20, right: 24,
    background: "#1a7a3c", color: "#fff",
    padding: "12px 20px", borderRadius: 10, fontSize: 13.5, fontWeight: 500,
    boxShadow: "0 6px 20px rgba(0,0,0,.15)", zIndex: 2000,
    animation: "fadeIn .3s ease",
  },
};

/* keyframes injected once */
if (typeof document !== "undefined" && !document.getElementById("rp-wa-anim")) {
  const s = document.createElement("style");
  s.id = "rp-wa-anim";
  s.textContent = `
    @keyframes spin    { to { transform: rotate(360deg); } }
    @keyframes fadeIn  { from { opacity:0; transform:translateY(-8px); } to { opacity:1; transform:translateY(0); } }
  `;
  document.head.appendChild(s);
}

export default SingleSendMessage;