
import React, { useEffect, useState } from "react";
import axios from "axios";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const TextEditor = () => {
  const [type, setType] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [allTexts, setAllTexts] = useState([]);

  useEffect(() => {
    fetchAllTexts();
  }, []);

  useEffect(() => {
    if (type) fetchText();
  }, [type]);

  const fetchAllTexts = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/get-all-texts`);
      setAllTexts(res.data);
    } catch {
      setAllTexts([]);
    }
  };

  const fetchText = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/get-text/${type}`);
      setContent(res.data.content || "");
    } catch {
      setContent("");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!type || !content.trim()) return alert("Type and content are required.");
    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/save-text`, { type, content });
      alert("Text saved successfully!");
      fetchAllTexts();
    } catch {
      alert("Failed to save text.");
    }
  };

  const handleSaveOrUpdate = async () => {
    if (!type || !content.trim()) return alert("Type and content are required.");
    try {
      setLoading(true);
      await axios.put(`${process.env.REACT_APP_API_URL}/update-text/${type}`, { content });
      alert("Text updated successfully!");
      fetchAllTexts();
    } catch {
      alert("Failed to update text.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!type) return alert("Type is required.");
    if (!window.confirm("Are you sure you want to delete this text?")) return;
    try {
      setLoading(true);
      await axios.delete(`${process.env.REACT_APP_API_URL}/delete-text/${type}`);
      alert("Text deleted successfully!");
      setContent("");
      fetchAllTexts();
    } catch {
      alert("Failed to delete text.");
    } finally {
      setLoading(false);
    }
  };

  // 🆕 NEW FUNCTION — Delete all texts
  const handleDeleteAll = async () => {
    if (!window.confirm("⚠️ Are you sure you want to delete ALL texts? This action cannot be undone.")) return;
    try {
      setLoading(true);
      await axios.delete(`${process.env.REACT_APP_API_URL}/delete-all-texts`);
      alert("All texts deleted successfully!");
      setContent("");
      setType("");
      fetchAllTexts();
    } catch {
      alert("Failed to delete all texts.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={containerStyle}>
      <h2 style={{ textAlign: "center" }}>Text Editor</h2>

      <select
        onChange={(e) => setType(e.target.value)}
        value={type}
        style={dropdownStyle}
      >
        <option value="">Select Type</option>
        {allTexts.map((text) => (
          <option key={text._id} value={text.type}>
            {text.type}
          </option>
        ))}
      </select>

      <input
        type="text"
        placeholder="Enter new type"
        value={type}
        onChange={(e) => setType(e.target.value)}
        style={inputStyle}
      />

      <ReactQuill
        value={content}
        onChange={setContent}
        style={{ height: "200px", marginBottom: "50px" }}
      />

      <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "10px" }}>
        <button onClick={handleSave} disabled={loading} style={buttonStyle}>Save</button>
        <button onClick={handleSaveOrUpdate} disabled={loading} style={buttonStyle}>Update</button>
        <button
          onClick={handleDelete}
          disabled={loading}
          style={{ ...buttonStyle, backgroundColor: "red" }}
        >
          {loading ? "Deleting..." : "Delete"}
        </button>

        {/* 🆕 Delete All Button */}
        <button
          onClick={handleDeleteAll}
          disabled={loading}
          style={{ ...buttonStyle, backgroundColor: "#6c757d" }}
        >
          {loading ? "Deleting All..." : "Delete All"}
        </button>
      </div>

      <div style={{ marginTop: "20px", borderTop: "2px solid #ddd", paddingTop: "15px" }}>
        <h3>All Saved Texts</h3>
        {allTexts.length === 0 ? (
          <p>No texts found.</p>
        ) : (
          <ul style={listStyle}>
            {allTexts.map((text) => (
              <li key={text._id} style={listItemStyle}>
                <strong>{text.type}</strong>:{" "}
                <span dangerouslySetInnerHTML={{ __html: text.content }} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

// Styles
const containerStyle = {
  maxWidth: "600px",
  margin: "auto",
  padding: "20px",
  border: "1px solid #ccc",
  borderRadius: "8px",
};
const buttonStyle = {
  padding: "10px 20px",
  fontSize: "16px",
  borderRadius: "4px",
  border: "none",
  cursor: "pointer",
  backgroundColor: "#007BFF",
  color: "white",
};
const dropdownStyle = {
  width: "100%",
  padding: "10px",
  marginBottom: "10px",
  borderRadius: "4px",
  border: "1px solid #ccc",
};
const inputStyle = {
  width: "100%",
  padding: "10px",
  marginBottom: "10px",
  borderRadius: "4px",
  border: "1px solid #ccc",
};
const listStyle = {
  listStyle: "none",
  padding: 0,
};
const listItemStyle = {
  padding: "10px",
  backgroundColor: "#f9f9f9",
  marginBottom: "5px",
  borderRadius: "4px",
  border: "1px solid #ddd",
};

export default TextEditor;
