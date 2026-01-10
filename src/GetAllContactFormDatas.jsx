import React, { useEffect, useState } from "react";
import axios from "axios";

const GetAllContactFormDatas = () => {
  const [contacts, setContacts] = useState([]);
  const [filteredContacts, setFilteredContacts] = useState([]);
  const [search, setSearch] = useState("");
  const [editingContact, setEditingContact] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/all-contactUs`);
      const sorted = res.data.data.sort(
        (a, b) => new Date(b.date) - new Date(a.date)
      ); // recent first
      setContacts(sorted);
      setFilteredContacts(sorted);
    } catch (error) {
      console.error("Failed to fetch contacts", error);
      setContacts([]);
      setFilteredContacts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearch(value);
    const filtered = contacts.filter(
      (contact) =>
        contact.name.toLowerCase().includes(value) ||
        contact.email.toLowerCase().includes(value) ||
        contact.phoneNumber.toLowerCase().includes(value)
    );
    setFilteredContacts(filtered);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this contact?")) return;
    try {
      setLoading(true);
      await axios.delete(`${process.env.REACT_APP_API_URL}/delete-contactUs/${id}`);
      alert("Contact deleted successfully!");
      fetchContacts();
    } catch {
      alert("Failed to delete contact.");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (contact) => {
    setEditingContact(contact);
  };

  const handleUpdate = async () => {
    if (
      !editingContact.name ||
      !editingContact.email ||
      !editingContact.phoneNumber ||
      !editingContact.message
    ) {
      return alert("All fields are required.");
    }

    try {
      setLoading(true);
      await axios.put(
        `${process.env.REACT_APP_API_URL}/update-contactUs/${editingContact._id}`,
        editingContact
      );
      alert("Contact updated successfully!");
      setEditingContact(null);
      fetchContacts();
    } catch {
      alert("Failed to update contact.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={containerStyle}>
      <h2 style={{ textAlign: "center" }}>Contact Us Management</h2>

      <input
        type="text"
        placeholder="Search by name, email, or phone number..."
        value={search}
        onChange={handleSearch}
        style={searchStyle}
      />

      {loading ? (
        <p>Loading...</p>
      ) : filteredContacts.length === 0 ? (
        <p>No contacts found.</p>
      ) : (
        <table style={tableStyle}>
          <thead>
            <tr style={tableHeaderStyle}>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Message</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredContacts.map((contact) => (
              <tr key={contact._id}>
                <td>
                  {editingContact?._id === contact._id ? (
                    <input
                      value={editingContact.name}
                      onChange={(e) =>
                        setEditingContact({
                          ...editingContact,
                          name: e.target.value,
                        })
                      }
                      style={inputEditStyle}
                    />
                  ) : (
                    contact.name
                  )}
                </td>
                <td>
                  {editingContact?._id === contact._id ? (
                    <input
                      value={editingContact.email}
                      onChange={(e) =>
                        setEditingContact({
                          ...editingContact,
                          email: e.target.value,
                        })
                      }
                      style={inputEditStyle}
                    />
                  ) : (
                    contact.email
                  )}
                </td>
                <td>
                  {editingContact?._id === contact._id ? (
                    <input
                      value={editingContact.phoneNumber}
                      onChange={(e) =>
                        setEditingContact({
                          ...editingContact,
                          phoneNumber: e.target.value,
                        })
                      }
                      style={inputEditStyle}
                    />
                  ) : (
                    contact.phoneNumber
                  )}
                </td>
                <td>
                  {editingContact?._id === contact._id ? (
                    <textarea
                      value={editingContact.message}
                      onChange={(e) =>
                        setEditingContact({
                          ...editingContact,
                          message: e.target.value,
                        })
                      }
                      style={inputEditStyle}
                    />
                  ) : (
                    contact.message
                  )}
                </td>
                <td>{new Date(contact.date).toLocaleString()}</td>
                <td>
                  {editingContact?._id === contact._id ? (
                    <>
                      <button onClick={handleUpdate} style={saveBtnStyle}>
                        Save
                      </button>
                      <button
                        onClick={() => setEditingContact(null)}
                        style={cancelBtnStyle}
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => handleEdit(contact)}
                        style={editBtnStyle}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(contact._id)}
                        style={deleteBtnStyle}
                      >
                        Delete
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

// Styles
const containerStyle = {
  maxWidth: "1000px",
  margin: "auto",
  padding: "20px",
};

const tableStyle = {
  width: "100%",
  borderCollapse: "collapse",
};

const tableHeaderStyle = {
  backgroundColor: "#007BFF",
  color: "white",
};

const searchStyle = {
  width: "100%",
  padding: "10px",
  marginBottom: "15px",
  borderRadius: "4px",
  border: "1px solid #ccc",
};

const inputEditStyle = {
  width: "100%",
  padding: "5px",
};

const editBtnStyle = {
  backgroundColor: "#17a2b8",
  color: "white",
  border: "none",
  padding: "6px 10px",
  marginRight: "5px",
  cursor: "pointer",
  borderRadius: "4px",
};

const saveBtnStyle = {
  backgroundColor: "#28a745",
  color: "white",
  border: "none",
  padding: "6px 10px",
  marginRight: "5px",
  cursor: "pointer",
  borderRadius: "4px",
};

const cancelBtnStyle = {
  backgroundColor: "#6c757d",
  color: "white",
  border: "none",
  padding: "6px 10px",
  marginRight: "5px",
  cursor: "pointer",
  borderRadius: "4px",
};

const deleteBtnStyle = {
  backgroundColor: "#dc3545",
  color: "white",
  border: "none",
  padding: "6px 10px",
  cursor: "pointer",
  borderRadius: "4px",
};

export default GetAllContactFormDatas;
