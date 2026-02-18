import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

const API = "/api/bulk-whatsapp";

const SCHEDULE_OPTIONS = [
  { label: "1 min", value: 1 },
  { label: "2 min", value: 2 },
  { label: "5 min", value: 5 },
  { label: "10 min", value: 10 },
  { label: "15 min", value: 15 },
  { label: "30 min", value: 30 },
];

// ─── Styles ──────────────────────────────────────────────────────────────────
const styles = {
  container: {
    fontFamily: "'Segoe UI', sans-serif",
    padding: "24px",
    background: "#f4f6f9",
    minHeight: "100vh",
    color: "#1a1a2e",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "24px",
  },
  title: {
    fontSize: "22px",
    fontWeight: 700,
    color: "#1a1a2e",
    margin: 0,
  },
  createBtn: {
    background: "linear-gradient(135deg, #25D366, #128C7E)",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    padding: "10px 20px",
    fontSize: "14px",
    fontWeight: 600,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    boxShadow: "0 4px 12px rgba(37,211,102,0.3)",
    transition: "opacity 0.2s",
  },
  // Modal overlay
  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.45)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
  },
  modal: {
    background: "#fff",
    borderRadius: "14px",
    padding: "28px 32px",
    width: "520px",
    maxWidth: "95vw",
    boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
    position: "relative",
  },
  modalTitle: {
    fontSize: "18px",
    fontWeight: 700,
    marginBottom: "20px",
    color: "#1a1a2e",
  },
  closeBtn: {
    position: "absolute",
    top: "16px",
    right: "16px",
    background: "none",
    border: "none",
    fontSize: "20px",
    cursor: "pointer",
    color: "#666",
  },
  label: {
    display: "block",
    fontSize: "13px",
    fontWeight: 600,
    marginBottom: "6px",
    color: "#333",
  },
  input: {
    width: "100%",
    padding: "10px 12px",
    border: "1.5px solid #ddd",
    borderRadius: "8px",
    fontSize: "14px",
    outline: "none",
    boxSizing: "border-box",
    transition: "border-color 0.2s",
  },
  textarea: {
    width: "100%",
    padding: "10px 12px",
    border: "1.5px solid #ddd",
    borderRadius: "8px",
    fontSize: "14px",
    outline: "none",
    boxSizing: "border-box",
    minHeight: "90px",
    resize: "vertical",
    transition: "border-color 0.2s",
  },
  select: {
    width: "100%",
    padding: "10px 12px",
    border: "1.5px solid #ddd",
    borderRadius: "8px",
    fontSize: "14px",
    outline: "none",
    background: "#fff",
    boxSizing: "border-box",
  },
  fieldGroup: { marginBottom: "18px" },
  tagContainer: {
    display: "flex",
    flexWrap: "wrap",
    gap: "8px",
    padding: "8px",
    border: "1.5px solid #ddd",
    borderRadius: "8px",
    minHeight: "44px",
    background: "#fafafa",
  },
  tag: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    background: "#e8f8f1",
    border: "1px solid #25D366",
    borderRadius: "20px",
    padding: "4px 10px",
    fontSize: "13px",
    color: "#128C7E",
    fontWeight: 600,
  },
  tagDup: {
    background: "#fff0f0",
    border: "1px solid #e74c3c",
    color: "#e74c3c",
  },
  tagRemove: {
    cursor: "pointer",
    fontSize: "14px",
    lineHeight: 1,
    fontWeight: 700,
  },
  numberInput: {
    border: "none",
    outline: "none",
    background: "transparent",
    fontSize: "14px",
    minWidth: "160px",
    flex: 1,
  },
  verifiedBadge: {
    fontSize: "11px",
    background: "#25D366",
    color: "#fff",
    borderRadius: "4px",
    padding: "1px 6px",
    fontWeight: 700,
  },
  dupBadge: {
    fontSize: "11px",
    background: "#e74c3c",
    color: "#fff",
    borderRadius: "4px",
    padding: "1px 6px",
    fontWeight: 700,
  },
  hint: {
    fontSize: "11px",
    color: "#888",
    marginTop: "4px",
  },
  submitBtn: {
    width: "100%",
    padding: "12px",
    background: "linear-gradient(135deg, #25D366, #128C7E)",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    fontSize: "15px",
    fontWeight: 700,
    cursor: "pointer",
    marginTop: "4px",
    boxShadow: "0 4px 12px rgba(37,211,102,0.3)",
  },
  // Table
  tableWrap: {
    background: "#fff",
    borderRadius: "12px",
    overflow: "hidden",
    boxShadow: "0 2px 12px rgba(0,0,0,0.07)",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    fontSize: "14px",
  },
  th: {
    background: "#1a1a2e",
    color: "#fff",
    padding: "13px 16px",
    textAlign: "left",
    fontWeight: 600,
    fontSize: "13px",
    whiteSpace: "nowrap",
  },
  td: {
    padding: "12px 16px",
    borderBottom: "1px solid #f0f0f0",
    verticalAlign: "middle",
    color: "#333",
  },
  badgeSent: {
    background: "#e8f8f1",
    color: "#128C7E",
    borderRadius: "20px",
    padding: "3px 12px",
    fontSize: "12px",
    fontWeight: 700,
    border: "1px solid #25D366",
  },
  badgePending: {
    background: "#fff8e6",
    color: "#e67e22",
    borderRadius: "20px",
    padding: "3px 12px",
    fontSize: "12px",
    fontWeight: 700,
    border: "1px solid #f39c12",
  },
  badgeFailed: {
    background: "#fff0f0",
    color: "#e74c3c",
    borderRadius: "20px",
    padding: "3px 12px",
    fontSize: "12px",
    fontWeight: 700,
    border: "1px solid #e74c3c",
  },
  deleteBtn: {
    background: "none",
    border: "1.5px solid #e74c3c",
    color: "#e74c3c",
    borderRadius: "6px",
    padding: "4px 10px",
    cursor: "pointer",
    fontSize: "12px",
    fontWeight: 600,
  },
  emptyRow: {
    textAlign: "center",
    padding: "40px",
    color: "#aaa",
    fontSize: "15px",
  },
  toast: {
    position: "fixed",
    bottom: "28px",
    right: "28px",
    background: "#1a1a2e",
    color: "#fff",
    padding: "12px 22px",
    borderRadius: "10px",
    fontSize: "14px",
    fontWeight: 600,
    zIndex: 2000,
    boxShadow: "0 6px 24px rgba(0,0,0,0.2)",
    animation: "fadeInUp 0.3s ease",
  },
};

// ─── Toast Component ──────────────────────────────────────────────────────────
function Toast({ msg }) {
  if (!msg) return null;
  return <div style={styles.toast}>{msg}</div>;
}

// ─── Status Badge ─────────────────────────────────────────────────────────────
function StatusBadge({ status }) {
  if (status === "Sent") return <span style={styles.badgeSent}>✓ Sent</span>;
  if (status === "Failed") return <span style={styles.badgeFailed}>✗ Failed</span>;
  return <span style={styles.badgePending}>⏳ Pending</span>;
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function BulkWhatsapp() {
  const [showModal, setShowModal] = useState(false);
  const [records, setRecords] = useState([]);
  const [toast, setToast] = useState("");
  const [loading, setLoading] = useState(false);

  // Form state
  const [numberInput, setNumberInput] = useState("");
  const [numbers, setNumbers] = useState([]); // [{ value, isDup }]
  const [message, setMessage] = useState("");
  const [scheduleMinutes, setScheduleMinutes] = useState(1);
  const inputRef = useRef(null);

  // ── Fetch records on mount & every 15s ──────────────────────────────────────
  useEffect(() => {
    fetchRecords();
    const interval = setInterval(fetchRecords, 15000);
    return () => clearInterval(interval);
  }, []);

  async function fetchRecords() {
    try {
      const res = await axios.get(`${API}/list`);
      setRecords(res.data.records || []);
    } catch (err) {
      console.error(err);
    }
  }

  function showToast(msg) {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  }

  // ── Number tag logic ─────────────────────────────────────────────────────────
  function addNumber(raw) {
    const val = raw.trim().replace(/\s+/g, "");
    if (!val) return;
    // Basic validation: only digits, 7-15 chars
    if (!/^\d{7,15}$/.test(val)) {
      showToast("Invalid number format: " + val);
      return;
    }
    const isDup = numbers.some((n) => n.value === val);
    setNumbers((prev) => [...prev, { value: val, isDup }]);
  }

  function handleNumberKeyDown(e) {
    if (["Enter", ",", " ", "Tab"].includes(e.key)) {
      e.preventDefault();
      if (numberInput.trim()) {
        addNumber(numberInput);
        setNumberInput("");
      }
    } else if (e.key === "Backspace" && !numberInput) {
      setNumbers((prev) => prev.slice(0, -1));
    }
  }

  function removeNumber(idx) {
    const removed = numbers[idx].value;
    setNumbers((prev) => {
      const updated = prev.filter((_, i) => i !== idx);
      // Re-check dups after removal
      return updated.map((n) => ({
        ...n,
        isDup: updated.filter((x) => x.value === n.value).length > 1,
      }));
    });
  }

  function resetForm() {
    setNumbers([]);
    setNumberInput("");
    setMessage("");
    setScheduleMinutes(1);
  }

  // ── Submit ───────────────────────────────────────────────────────────────────
  async function handleSubmit() {
    const validNumbers = numbers.filter((n) => !n.isDup).map((n) => n.value);
    if (validNumbers.length === 0) {
      showToast("Please add at least one valid, non-duplicate number.");
      return;
    }
    if (!message.trim()) {
      showToast("Please enter a message.");
      return;
    }
    setLoading(true);
    try {
      const res = await axios.post(`${API}/create`, {
        phoneNumbers: validNumbers,
        message: message.trim(),
        scheduleMinutes: Number(scheduleMinutes),
      });
      showToast(`✓ Scheduled ${res.data.totalScheduled} message(s)!`);
      resetForm();
      setShowModal(false);
      fetchRecords();
    } catch (err) {
      showToast("Error: " + (err.response?.data?.error || err.message));
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm("Delete this record?")) return;
    try {
      await axios.delete(`${API}/${id}`);
      setRecords((prev) => prev.filter((r) => r._id !== id));
      showToast("Deleted.");
    } catch (err) {
      showToast("Delete failed.");
    }
  }

  const hasDuplicates = numbers.some((n) => n.isDup);

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <h1 style={styles.title}>📲 Bulk WhatsApp Messages</h1>
        <button style={styles.createBtn} onClick={() => setShowModal(true)}>
          <span>＋</span> Create New Message
        </button>
      </div>

      {/* Table */}
      <div style={styles.tableWrap}>
        <table style={styles.table}>
          <thead>
            <tr>
              {["SI.No", "Phone Number", "Message", "Schedule Time", "Status", "Action"].map(
                (h) => (
                  <th key={h} style={styles.th}>
                    {h}
                  </th>
                )
              )}
            </tr>
          </thead>
          <tbody>
            {records.length === 0 ? (
              <tr>
                <td colSpan={6} style={styles.emptyRow}>
                  No messages yet. Click "Create New Message" to get started.
                </td>
              </tr>
            ) : (
              records.map((rec, idx) => (
                <tr
                  key={rec._id}
                  style={{ background: idx % 2 === 0 ? "#fff" : "#fafafa" }}
                >
                  <td style={styles.td}>{idx + 1}</td>
                  <td style={{ ...styles.td, fontWeight: 600 }}>{rec.phoneNumber}</td>
                  <td style={{ ...styles.td, maxWidth: "220px", wordBreak: "break-word" }}>
                    {rec.message}
                  </td>
                  <td style={styles.td}>
                    {new Date(rec.scheduleTime).toLocaleString()} ({rec.scheduleMinutes} min)
                  </td>
                  <td style={styles.td}>
                    <StatusBadge status={rec.status} />
                  </td>
                  <td style={styles.td}>
                    <button
                      style={styles.deleteBtn}
                      onClick={() => handleDelete(rec._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <div style={styles.overlay} onClick={() => setShowModal(false)}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <button style={styles.closeBtn} onClick={() => setShowModal(false)}>
              ×
            </button>
            <div style={styles.modalTitle}>📤 Create Bulk Message</div>

            {/* Phone Numbers */}
            <div style={styles.fieldGroup}>
              <label style={styles.label}>
                Phone Numbers{" "}
                <span style={{ color: "#888", fontWeight: 400 }}>
                  (press Enter / comma to add)
                </span>
              </label>
              <div
                style={styles.tagContainer}
                onClick={() => inputRef.current?.focus()}
              >
                {numbers.map((n, i) => (
                  <span
                    key={i}
                    style={{ ...styles.tag, ...(n.isDup ? styles.tagDup : {}) }}
                  >
                    {n.isDup ? (
                      <span style={styles.dupBadge}>DUP</span>
                    ) : (
                      <span style={styles.verifiedBadge}>✓</span>
                    )}
                    {n.value}
                    <span style={styles.tagRemove} onClick={() => removeNumber(i)}>
                      ×
                    </span>
                  </span>
                ))}
                <input
                  ref={inputRef}
                  style={styles.numberInput}
                  value={numberInput}
                  onChange={(e) => setNumberInput(e.target.value)}
                  onKeyDown={handleNumberKeyDown}
                  onBlur={() => {
                    if (numberInput.trim()) {
                      addNumber(numberInput);
                      setNumberInput("");
                    }
                  }}
                  placeholder={numbers.length === 0 ? "Enter number e.g. 919876543210" : ""}
                />
              </div>
              {hasDuplicates && (
                <p style={{ ...styles.hint, color: "#e74c3c" }}>
                  ⚠ Duplicate numbers are marked in red and will be excluded.
                </p>
              )}
              {numbers.filter((n) => !n.isDup).length > 0 && (
                <p style={{ ...styles.hint, color: "#25D366" }}>
                  ✓ {numbers.filter((n) => !n.isDup).length} unique number(s) verified.
                </p>
              )}
            </div>

            {/* Message */}
            <div style={styles.fieldGroup}>
              <label style={styles.label}>Message</label>
              <textarea
                style={styles.textarea}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your WhatsApp message here..."
              />
              <p style={styles.hint}>{message.length} characters</p>
            </div>

            {/* Schedule */}
            <div style={styles.fieldGroup}>
              <label style={styles.label}>Schedule Delay</label>
              <select
                style={styles.select}
                value={scheduleMinutes}
                onChange={(e) => setScheduleMinutes(e.target.value)}
              >
                {SCHEDULE_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            <button
              style={{
                ...styles.submitBtn,
                opacity: loading ? 0.7 : 1,
                cursor: loading ? "not-allowed" : "pointer",
              }}
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? "Scheduling..." : "Schedule Messages"}
            </button>
          </div>
        </div>
      )}

      <Toast msg={toast} />
    </div>
  );
}