// ProtectedRoute.jsx
// Wraps every route in Dashboard.jsx — if the user's role doesn't have
// permission for this page key, they see an Access Denied screen instead
// of the actual page, even if they type the URL directly.

import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { MdSecurity } from "react-icons/md";

const ProtectedRoute = ({ element, permissionKey }) => {
  const [allowedFiles, setAllowedFiles] = useState(null); // null = still loading

  const reduxAdminRole = useSelector((state) => state.admin?.role);
  const adminRole = reduxAdminRole || localStorage.getItem("adminRole");

  // ── Read permissions from localStorage (already cached at login) ──
  useEffect(() => {
    const readPermissions = () => {
      try {
        const cached = localStorage.getItem("rolePermissions");
        if (!cached) {
          // No cache yet — allow access while loading (will resolve quickly)
          setAllowedFiles(null);
          return;
        }
        const perms = JSON.parse(cached);
        const rolePerms = perms.find((p) => p.role === adminRole);
        setAllowedFiles(rolePerms?.viewedFiles?.map((f) => f.trim()) || []);
      } catch (_) {
        setAllowedFiles([]);
      }
    };

    readPermissions();

    // ── Also react in real-time when UserRolls changes permissions ──
    const handlePermissionUpdate = (e) => {
      const perms = e.detail;
      const rolePerms = perms.find((p) => p.role === adminRole);
      setAllowedFiles(rolePerms?.viewedFiles?.map((f) => f.trim()) || []);
    };

    window.addEventListener("permissionsUpdated", handlePermissionUpdate);
    return () => window.removeEventListener("permissionsUpdated", handlePermissionUpdate);
  }, [adminRole]);

  // ── Still loading permissions — render nothing briefly ──
  if (allowedFiles === null) {
    return null;
  }

  // ── No permissionKey means the route is public (no restriction) ──
  if (!permissionKey) {
    return element;
  }

  // ── Check if this role has access to this page ──
  if (!allowedFiles.includes(permissionKey.trim())) {
    return (
      <div style={styles.wrapper}>
        <div style={styles.card}>
          <MdSecurity size={64} color="#ef4444" style={{ marginBottom: 16 }} />
          <h2 style={styles.title}>Access Denied</h2>
          <p style={styles.msg}>
            You don't have permission to view this page.
          </p>
          <p style={styles.sub}>
            Contact your administrator to request access.
          </p>
        </div>
      </div>
    );
  }

  return element;
};

const styles = {
  wrapper: {
    display: "flex", alignItems: "center", justifyContent: "center",
    minHeight: "80vh", background: "#F0F2F5",
  },
  card: {
    background: "#fff", borderRadius: 16, padding: "48px 40px",
    textAlign: "center", boxShadow: "0 4px 24px rgba(0,0,0,0.1)",
    maxWidth: 420, width: "100%",
  },
  title: { fontSize: 24, fontWeight: 700, color: "#1a1a2e", margin: "0 0 12px" },
  msg: { fontSize: 15, color: "#555", margin: "0 0 8px" },
  sub: { fontSize: 13, color: "#aaa", margin: "0 0 28px" },
  btn: {
    background: "#1a7c3e", color: "#fff", border: "none",
    padding: "10px 24px", borderRadius: 8, fontSize: 14,
    fontWeight: 600, cursor: "pointer",
  },
};

export default ProtectedRoute;