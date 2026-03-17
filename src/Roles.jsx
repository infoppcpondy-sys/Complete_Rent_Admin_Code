import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useSelector } from 'react-redux';
import moment from 'moment';
import "./RolesStyles.css";

const BASE_URL = `${process.env.REACT_APP_API_URL}/role-access`;

// ─── All groups in display order ─────────────────────────────────────────────
const GROUP_COLORS = {
  Reports:       { bg: "#EFF6FF", border: "#BFDBFE", badge: "#1D4ED8", dot: "#3B82F6" },
  Analytics:     { bg: "#F0FDF4", border: "#BBF7D0", badge: "#15803D", dot: "#22C55E" },
  Plans:         { bg: "#FFF7ED", border: "#FED7AA", badge: "#C2410C", dot: "#F97316" },
  Users:         { bg: "#FAF5FF", border: "#E9D5FF", badge: "#7E22CE", dot: "#A855F7" },
  Properties:    { bg: "#FFF1F2", border: "#FECDD3", badge: "#BE123C", dot: "#F43F5E" },
  Buyers:        { bg: "#ECFEFF", border: "#A5F3FC", badge: "#0E7490", dot: "#06B6D4" },
  Billing:       { bg: "#FEFCE8", border: "#FEF08A", badge: "#A16207", dot: "#EAB308" },
  Payments:      { bg: "#F0FDF4", border: "#BBF7D0", badge: "#166534", dot: "#16A34A" },
  FollowUps:     { bg: "#FFF7ED", border: "#FDBA74", badge: "#9A3412", dot: "#EA580C" },
  Leads:         { bg: "#FDF2F8", border: "#F5D0FE", badge: "#86198F", dot: "#D946EF" },
  Location:      { bg: "#F0F9FF", border: "#BAE6FD", badge: "#075985", dot: "#0EA5E9" },
  Communication: { bg: "#F0FDF4", border: "#86EFAC", badge: "#14532D", dot: "#4ADE80" },
  Settings:      { bg: "#F8FAFC", border: "#CBD5E1", badge: "#334155", dot: "#64748B" },
  Media:         { bg: "#FFF8F0", border: "#FDBA74", badge: "#92400E", dot: "#F59E0B" },
};

// ─── Toast ────────────────────────────────────────────────────────────────────
function Toast({ toasts, removeToast }) {
  return (
    <div style={{ position: "fixed", top: 20, right: 20, zIndex: 9999, display: "flex", flexDirection: "column", gap: 10 }}>
      {toasts.map((t) => (
        <div key={t.id} onClick={() => removeToast(t.id)}
          style={{
            padding: "12px 20px", borderRadius: 10, cursor: "pointer",
            background: t.type === "success" ? "#22C55E" : t.type === "error" ? "#EF4444" : "#3B82F6",
            color: "#fff", fontWeight: 600, fontSize: 14, boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
            minWidth: 260, display: "flex", alignItems: "center", gap: 10,
            animation: "slideIn 0.3s ease",
          }}>
          <span>{t.type === "success" ? "✓" : t.type === "error" ? "✕" : "ℹ"}</span>
          {t.message}
        </div>
      ))}
    </div>
  );
}

// ─── Badge ────────────────────────────────────────────────────────────────────
function Badge({ label, color }) {
  return (
    <span style={{
      display: "inline-block", padding: "2px 10px", borderRadius: 20, fontSize: 11,
      fontWeight: 700, background: color + "22", color, letterSpacing: 0.5,
      textTransform: "uppercase",
    }}>{label}</span>
  );
}

// ─── Modal ────────────────────────────────────────────────────────────────────
function Modal({ show, onClose, title, children, width = 800 }) {
  if (!show) return null;
  return (
    <div onClick={onClose} style={{
      position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 1000,
      display: "flex", alignItems: "center", justifyContent: "center", padding: 16,
    }}>
      <div onClick={(e) => e.stopPropagation()} style={{
        background: "#fff", borderRadius: 16, width: "100%", maxWidth: width,
        maxHeight: "90vh", overflow: "hidden", display: "flex", flexDirection: "column",
        boxShadow: "0 25px 60px rgba(0,0,0,0.25)",
      }}>
        <div style={{ padding: "20px 24px", borderBottom: "1px solid #E5E7EB", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: "#111827" }}>{title}</h3>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 20, color: "#6B7280", lineHeight: 1 }}>×</button>
        </div>
        <div style={{ overflowY: "auto", flex: 1 }}>{children}</div>
      </div>
    </div>
  );
}

// ─── Permission Checkbox Grid ─────────────────────────────────────────────────
function PermissionGrid({ allPermissions, selected, onChange }) {
  const groups = {};
  allPermissions.forEach((p) => {
    if (!groups[p.group]) groups[p.group] = [];
    groups[p.group].push(p);
  });

  const toggleAll = (groupPerms, checked) => {
    if (checked) {
      const keys = groupPerms.map((p) => p.key);
      const merged = Array.from(new Set([...selected, ...keys]));
      onChange(merged);
    } else {
      const keys = groupPerms.map((p) => p.key);
      onChange(selected.filter((s) => !keys.includes(s)));
    }
  };

  const toggle = (key) => {
    if (selected.includes(key)) onChange(selected.filter((s) => s !== key));
    else onChange([...selected, key]);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16, padding: "20px 24px" }}>
      {/* Select / Deselect All */}
      <div style={{ display: "flex", gap: 10, marginBottom: 4 }}>
        <button onClick={() => onChange(allPermissions.map((p) => p.key))}
          style={{ padding: "6px 16px", borderRadius: 8, border: "1.5px solid #3B82F6", background: "#EFF6FF", color: "#1D4ED8", fontWeight: 600, fontSize: 13, cursor: "pointer" }}>
          ✓ Select All
        </button>
        <button onClick={() => onChange([])}
          style={{ padding: "6px 16px", borderRadius: 8, border: "1.5px solid #E5E7EB", background: "#F9FAFB", color: "#6B7280", fontWeight: 600, fontSize: 13, cursor: "pointer" }}>
          ✕ Clear All
        </button>
        <span style={{ marginLeft: "auto", fontSize: 13, color: "#6B7280", alignSelf: "center" }}>
          <strong style={{ color: "#111827" }}>{selected.length}</strong> / {allPermissions.length} selected
        </span>
      </div>

      {Object.entries(groups).map(([group, perms]) => {
        const c = GROUP_COLORS[group] || GROUP_COLORS.Settings;
        const allChecked = perms.every((p) => selected.includes(p.key));
        const someChecked = perms.some((p) => selected.includes(p.key));
        return (
          <div key={group} style={{ border: `1.5px solid ${c.border}`, borderRadius: 12, overflow: "hidden" }}>
            {/* Group Header */}
            <div style={{ background: c.bg, padding: "10px 16px", display: "flex", alignItems: "center", gap: 10, borderBottom: `1px solid ${c.border}` }}>
              <input type="checkbox" checked={allChecked} ref={el => { if (el) el.indeterminate = !allChecked && someChecked; }}
                onChange={(e) => toggleAll(perms, e.target.checked)}
                style={{ width: 16, height: 16, cursor: "pointer", accentColor: c.badge }} />
              <span style={{ fontWeight: 700, color: c.badge, fontSize: 13, textTransform: "uppercase", letterSpacing: 0.8 }}>{group}</span>
              <span style={{ marginLeft: "auto", fontSize: 12, color: c.badge, opacity: 0.7 }}>
                {perms.filter((p) => selected.includes(p.key)).length}/{perms.length}
              </span>
            </div>
            {/* Permissions Grid */}
            <div style={{ padding: 12, display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 8 }}>
              {perms.map((p) => {
                const checked = selected.includes(p.key);
                return (
                  <label key={p.key} style={{
                    display: "flex", alignItems: "center", gap: 8, padding: "6px 10px",
                    borderRadius: 8, cursor: "pointer", transition: "background 0.15s",
                    background: checked ? c.bg : "transparent",
                    border: checked ? `1px solid ${c.border}` : "1px solid transparent",
                  }}>
                    <input type="checkbox" checked={checked} onChange={() => toggle(p.key)}
                      style={{ width: 15, height: 15, cursor: "pointer", accentColor: c.badge }} />
                    <span style={{ fontSize: 13, color: checked ? c.badge : "#374151", fontWeight: checked ? 600 : 400 }}>
                      {p.label}
                    </span>
                  </label>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─── Role Form Modal ──────────────────────────────────────────────────────────
function RoleFormModal({ show, onClose, onSave, allPermissions, editRole }) {
  const [roleName, setRoleName] = useState("");
  const [description, setDescription] = useState("");
  const [permissions, setPermissions] = useState([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (editRole) {
      setRoleName(editRole.roleName);
      setDescription(editRole.description || "");
      setPermissions(editRole.permissions || []);
    } else {
      setRoleName(""); setDescription(""); setPermissions([]);
    }
  }, [editRole, show]);

  const handleSave = async () => {
    if (!roleName.trim()) return;
    setSaving(true);
    await onSave({ roleName, description, permissions });
    setSaving(false);
  };

  return (
    <Modal show={show} onClose={onClose} title={editRole ? "Edit Role" : "Create New Role"} width={900}>
      <div style={{ padding: "16px 24px", borderBottom: "1px solid #E5E7EB", display: "flex", gap: 16 }}>
        <div style={{ flex: 1 }}>
          <label style={{ display: "block", marginBottom: 6, fontSize: 13, fontWeight: 600, color: "#374151" }}>Role Name *</label>
          <input value={roleName} onChange={(e) => setRoleName(e.target.value)}
            placeholder="e.g. Sales Manager"
            style={{ width: "100%", padding: "9px 14px", borderRadius: 8, border: "1.5px solid #D1D5DB", fontSize: 14, outline: "none", boxSizing: "border-box" }} />
        </div>
        <div style={{ flex: 2 }}>
          <label style={{ display: "block", marginBottom: 6, fontSize: 13, fontWeight: 600, color: "#374151" }}>Description</label>
          <input value={description} onChange={(e) => setDescription(e.target.value)}
            placeholder="Brief description of this role..."
            style={{ width: "100%", padding: "9px 14px", borderRadius: 8, border: "1.5px solid #D1D5DB", fontSize: 14, outline: "none", boxSizing: "border-box" }} />
        </div>
      </div>
      <PermissionGrid allPermissions={allPermissions} selected={permissions} onChange={setPermissions} />
      <div style={{ padding: "16px 24px", borderTop: "1px solid #E5E7EB", display: "flex", justifyContent: "flex-end", gap: 10 }}>
        <button onClick={onClose} style={{ padding: "9px 20px", borderRadius: 8, border: "1.5px solid #D1D5DB", background: "#fff", color: "#374151", fontWeight: 600, fontSize: 14, cursor: "pointer" }}>
          Cancel
        </button>
        <button onClick={handleSave} disabled={!roleName.trim() || saving}
          style={{ padding: "9px 24px", borderRadius: 8, border: "none", background: roleName.trim() ? "#1D4ED8" : "#93C5FD", color: "#fff", fontWeight: 700, fontSize: 14, cursor: roleName.trim() ? "pointer" : "not-allowed" }}>
          {saving ? "Saving..." : editRole ? "Update Role" : "Create Role"}
        </button>
      </div>
    </Modal>
  );
}

// ─── View Permissions Modal ───────────────────────────────────────────────────
function ViewPermissionsModal({ show, onClose, role, allPermissions }) {
  if (!role) return null;
  const groups = {};
  allPermissions.forEach((p) => {
    if (!groups[p.group]) groups[p.group] = [];
    groups[p.group].push(p);
  });

  return (
    <Modal show={show} onClose={onClose} title={`Permissions: ${role.roleName}`} width={800}>
      <div style={{ padding: "20px 24px", display: "flex", flexDirection: "column", gap: 14 }}>
        <p style={{ margin: 0, color: "#6B7280", fontSize: 14 }}>
          {role.permissions?.length || 0} permissions granted
          {role.description && <> · <em>{role.description}</em></>}
        </p>
        {Object.entries(groups).map(([group, perms]) => {
          const granted = perms.filter((p) => role.permissions?.includes(p.key));
          if (!granted.length) return null;
          const c = GROUP_COLORS[group] || GROUP_COLORS.Settings;
          return (
            <div key={group} style={{ border: `1.5px solid ${c.border}`, borderRadius: 10, overflow: "hidden" }}>
              <div style={{ background: c.bg, padding: "8px 14px", display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ width: 8, height: 8, borderRadius: "50%", background: c.dot, display: "inline-block" }} />
                <span style={{ fontWeight: 700, color: c.badge, fontSize: 12, textTransform: "uppercase", letterSpacing: 0.8 }}>{group}</span>
                <span style={{ fontSize: 12, color: c.badge, opacity: 0.6, marginLeft: "auto" }}>{granted.length}/{perms.length}</span>
              </div>
              <div style={{ padding: "10px 14px", display: "flex", flexWrap: "wrap", gap: 6 }}>
                {granted.map((p) => (
                  <span key={p.key} style={{ padding: "3px 10px", borderRadius: 20, fontSize: 12, fontWeight: 600, background: c.bg, color: c.badge, border: `1px solid ${c.border}` }}>
                    {p.label}
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </Modal>
  );
}

// ─── Delete Confirm Modal ─────────────────────────────────────────────────────
function DeleteModal({ show, onClose, onConfirm, roleName, deleting }) {
  return (
    <Modal show={show} onClose={onClose} title="Delete Role" width={420}>
      <div style={{ padding: 24 }}>
        <p style={{ margin: "0 0 20px", color: "#374151", fontSize: 15, lineHeight: 1.6 }}>
          Are you sure you want to delete <strong>"{roleName}"</strong>? This action cannot be undone.
        </p>
        <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
          <button onClick={onClose} style={{ padding: "9px 20px", borderRadius: 8, border: "1.5px solid #D1D5DB", background: "#fff", fontWeight: 600, fontSize: 14, cursor: "pointer" }}>Cancel</button>
          <button onClick={onConfirm} disabled={deleting}
            style={{ padding: "9px 24px", borderRadius: 8, border: "none", background: "#EF4444", color: "#fff", fontWeight: 700, fontSize: 14, cursor: "pointer" }}>
            {deleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </Modal>
  );
}

// ─── Main Roles Component ─────────────────────────────────────────────────────
export default function Roles() {
  const [roles, setRoles] = useState([]);
  const [allPermissions, setAllPermissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [toasts, setToasts] = useState([]);
  const [allowedRoles, setAllowedRoles] = useState([]);

  const [showForm, setShowForm] = useState(false);
  const [editRole, setEditRole] = useState(null);
  const [viewRole, setViewRole] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fileName = "Roles";
  const reduxAdminName = useSelector((state) => state.admin.name);
  const reduxAdminRole = useSelector((state) => state.admin.role);
  const adminName = reduxAdminName || localStorage.getItem("adminName");
  const adminRole = reduxAdminRole || localStorage.getItem("adminRole");

  // ── Toast helpers ──
  const addToast = useCallback((message, type = "success") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3500);
  }, []);
  const removeToast = (id) => setToasts((prev) => prev.filter((t) => t.id !== id));

  // ── Record admin visit for tracking ──
  useEffect(() => {
    if (adminName && adminRole) {
      axios.post(`${process.env.REACT_APP_API_URL}/record-view`, {
        userName: adminName,
        role: adminRole,
        viewedFile: fileName,
      }).catch(() => {});
    }
  }, [adminName, adminRole]);

  // ── Fetch role-based permissions ──
  useEffect(() => {
    if (adminRole) {
      axios.get(`${process.env.REACT_APP_API_URL}/get-role-permissions`)
        .then((res) => {
          const permissions = res.data;
          const roleData = permissions.find((r) => r.role === adminRole);
          setAllowedRoles(roleData?.viewedFiles || []);
        })
        .catch(() => {});
    }
  }, [adminRole]);

  // ── Fetch roles and permissions ──
  const fetchAll = useCallback(async () => {
    try {
      setLoading(true);
      const [rolesRes, permsRes] = await Promise.all([
        axios.get(BASE_URL),
        axios.get(`${BASE_URL}/permissions`),
      ]);
      setRoles(rolesRes.data.roles || []);
      setAllPermissions(permsRes.data.permissions || []);
    } catch {
      addToast("Failed to load data", "error");
    } finally {
      setLoading(false);
    }
  }, [addToast]);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  // ── Create / Update ──
  const handleSave = async ({ roleName, description, permissions }) => {
    try {
      if (editRole) {
        await axios.put(`${BASE_URL}/${editRole._id}`, { roleName, description, permissions });
        addToast("Role updated successfully");
      } else {
        await axios.post(BASE_URL, { roleName, description, permissions, createdBy: adminName });
        addToast("Role created successfully");
      }
      setShowForm(false);
      setEditRole(null);
      fetchAll();
    } catch (err) {
      addToast(err.response?.data?.message || "Failed to save role", "error");
    }
  };

  // ── Delete ──
  const handleDelete = async () => {
    setDeleting(true);
    try {
      await axios.delete(`${BASE_URL}/${deleteTarget._id}`);
      addToast("Role deleted successfully");
      setDeleteTarget(null);
      fetchAll();
    } catch {
      addToast("Failed to delete role", "error");
    } finally {
      setDeleting(false);
    }
  };

  // ── Toggle active ──
  const handleToggle = async (role) => {
    try {
      await axios.patch(`${BASE_URL}/${role._id}/toggle`);
      addToast(`Role ${role.isActive ? "deactivated" : "activated"}`);
      fetchAll();
    } catch {
      addToast("Failed to toggle role", "error");
    }
  };

  // ── Duplicate ──
  const handleDuplicate = async (role) => {
    try {
      await axios.post(`${BASE_URL}/${role._id}/duplicate`, { createdBy: adminName });
      addToast("Role duplicated successfully");
      fetchAll();
    } catch {
      addToast("Failed to duplicate role", "error");
    }
  };

  const filtered = roles.filter((r) =>
    r.roleName.toLowerCase().includes(search.toLowerCase()) ||
    (r.description || "").toLowerCase().includes(search.toLowerCase())
  );

  const totalPermissions = allPermissions.length;

  if (loading) return <div style={{ textAlign: "center", padding: "80px 20px", color: "#6B7280" }}><p>⏳ Loading roles...</p></div>;

  return (
    <>
      <style>{`
        @keyframes slideIn { from { opacity:0; transform: translateX(30px); } to { opacity:1; transform: translateX(0); } }
        .role-card:hover { box-shadow: 0 8px 30px rgba(0,0,0,0.12) !important; transform: translateY(-2px); }
        .role-card { transition: all 0.2s ease; }
        .action-btn:hover { opacity: 0.85; transform: scale(1.05); }
        .action-btn { transition: all 0.15s ease; }
      `}</style>
      <Toast toasts={toasts} removeToast={removeToast} />

      <div style={{ padding: "24px", fontFamily: "'Segoe UI', system-ui, sans-serif", maxWidth: 1300, margin: "0 auto" }}>

        {/* ── Header ── */}
        <div style={{ marginBottom: 28, display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 16 }}>
          <div>
            <h1 style={{ margin: 0, fontSize: 28, fontWeight: 800, color: "#111827", letterSpacing: -0.5 }}>
              🛡️ Roles & Permissions
            </h1>
            <p style={{ margin: "6px 0 0", color: "#6B7280", fontSize: 14 }}>
              Manage admin roles and control page-level access
            </p>
          </div>
          <button onClick={() => { setEditRole(null); setShowForm(true); }}
            style={{ padding: "10px 22px", borderRadius: 10, border: "none", background: "linear-gradient(135deg,#1D4ED8,#7C3AED)", color: "#fff", fontWeight: 700, fontSize: 14, cursor: "pointer", display: "flex", alignItems: "center", gap: 8, boxShadow: "0 4px 14px rgba(29,78,216,0.35)" }}>
            + Create Role
          </button>
        </div>

        {/* ── Stats Strip ── */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))", gap: 14, marginBottom: 28 }}>
          {[
            { label: "Total Roles", value: roles.length, color: "#1D4ED8", bg: "#EFF6FF" },
            { label: "Active Roles", value: roles.filter((r) => r.isActive).length, color: "#15803D", bg: "#F0FDF4" },
            { label: "Inactive Roles", value: roles.filter((r) => !r.isActive).length, color: "#C2410C", bg: "#FFF7ED" },
            { label: "Total Permissions", value: totalPermissions, color: "#7E22CE", bg: "#FAF5FF" },
          ].map((s) => (
            <div key={s.label} style={{ background: s.bg, borderRadius: 12, padding: "16px 20px", border: `1.5px solid ${s.color}22` }}>
              <div style={{ fontSize: 26, fontWeight: 800, color: s.color }}>{s.value}</div>
              <div style={{ fontSize: 12, color: "#6B7280", fontWeight: 600, marginTop: 2 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* ── Search ── */}
        <div style={{ marginBottom: 20 }}>
          <input value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="🔍  Search roles..."
            style={{ width: "100%", maxWidth: 380, padding: "9px 16px", borderRadius: 10, border: "1.5px solid #D1D5DB", fontSize: 14, outline: "none", boxSizing: "border-box" }} />
        </div>

        {/* ── Content ── */}
        {filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: 80, color: "#6B7280" }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>🏷️</div>
            <p style={{ fontSize: 16, fontWeight: 600, color: "#374151" }}>No roles found</p>
            <p style={{ fontSize: 14 }}>{search ? "Try a different search" : "Create your first role to get started"}</p>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(360px,1fr))", gap: 16 }}>
            {filtered.map((role) => {
              const pct = totalPermissions > 0 ? Math.round((role.permissions?.length || 0) / totalPermissions * 100) : 0;
              const groupCount = {};
              (role.permissions || []).forEach((key) => {
                const p = allPermissions.find((a) => a.key === key);
                if (p) groupCount[p.group] = (groupCount[p.group] || 0) + 1;
              });
              const topGroups = Object.entries(groupCount).sort((a, b) => b[1] - a[1]).slice(0, 4);

              return (
                <div key={role._id} className="role-card" style={{ background: "#fff", borderRadius: 14, border: "1.5px solid #E5E7EB", padding: 20, boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
                  {/* Card Header */}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                        <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: "#111827" }}>{role.roleName}</h3>
                        <Badge label={role.isActive ? "Active" : "Inactive"} color={role.isActive ? "#15803D" : "#C2410C"} />
                      </div>
                      {role.description && <p style={{ margin: 0, fontSize: 12, color: "#6B7280", lineHeight: 1.4 }}>{role.description}</p>}
                    </div>
                  </div>

                  {/* Permission bar */}
                  <div style={{ marginBottom: 12 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                      <span style={{ fontSize: 12, color: "#6B7280" }}>{role.permissions?.length || 0} permissions</span>
                      <span style={{ fontSize: 12, fontWeight: 700, color: "#374151" }}>{pct}%</span>
                    </div>
                    <div style={{ height: 6, background: "#F3F4F6", borderRadius: 10, overflow: "hidden" }}>
                      <div style={{ height: "100%", width: `${pct}%`, background: "linear-gradient(90deg,#3B82F6,#8B5CF6)", borderRadius: 10, transition: "width 0.5s ease" }} />
                    </div>
                  </div>

                  {/* Top groups */}
                  {topGroups.length > 0 && (
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginBottom: 16 }}>
                      {topGroups.map(([group, count]) => {
                        const c = GROUP_COLORS[group] || GROUP_COLORS.Settings;
                        return (
                          <span key={group} style={{ padding: "2px 8px", borderRadius: 20, fontSize: 11, fontWeight: 600, background: c.bg, color: c.badge, border: `1px solid ${c.border}` }}>
                            {group} ({count})
                          </span>
                        );
                      })}
                    </div>
                  )}

                  {/* Actions */}
                  <div style={{ display: "flex", gap: 8, borderTop: "1px solid #F3F4F6", paddingTop: 14, flexWrap: "wrap" }}>
                    <button className="action-btn" onClick={() => setViewRole(role)}
                      style={{ flex: 1, padding: "7px 0", borderRadius: 8, border: "1.5px solid #E5E7EB", background: "#F9FAFB", color: "#374151", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>
                      👁 View
                    </button>
                    <button className="action-btn" onClick={() => { setEditRole(role); setShowForm(true); }}
                      style={{ flex: 1, padding: "7px 0", borderRadius: 8, border: "1.5px solid #BFDBFE", background: "#EFF6FF", color: "#1D4ED8", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>
                      ✏️ Edit
                    </button>
                    <button className="action-btn" onClick={() => handleDuplicate(role)}
                      style={{ flex: 1, padding: "7px 0", borderRadius: 8, border: "1.5px solid #E9D5FF", background: "#FAF5FF", color: "#7E22CE", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>
                      ⧉ Copy
                    </button>
                    <button className="action-btn" onClick={() => handleToggle(role)}
                      style={{ flex: 1, padding: "7px 0", borderRadius: 8, border: `1.5px solid ${role.isActive ? "#FED7AA" : "#BBF7D0"}`, background: role.isActive ? "#FFF7ED" : "#F0FDF4", color: role.isActive ? "#C2410C" : "#15803D", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>
                      {role.isActive ? "⏸ Off" : "▶ On"}
                    </button>
                    <button className="action-btn" onClick={() => setDeleteTarget(role)}
                      style={{ padding: "7px 12px", borderRadius: 8, border: "1.5px solid #FECDD3", background: "#FFF1F2", color: "#BE123C", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>
                      🗑
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ── Modals ── */}
      <RoleFormModal
        show={showForm}
        onClose={() => { setShowForm(false); setEditRole(null); }}
        onSave={handleSave}
        allPermissions={allPermissions}
        editRole={editRole}
      />
      <ViewPermissionsModal
        show={!!viewRole}
        onClose={() => setViewRole(null)}
        role={viewRole}
        allPermissions={allPermissions}
      />
      <DeleteModal
        show={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        roleName={deleteTarget?.roleName}
        deleting={deleting}
      />
    </>
  );
}
