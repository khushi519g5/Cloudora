import React from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  MessageSquareText,
  Info,
  LogOut,
  User
} from "lucide-react";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar navbar-expand-lg sticky-top shadow-sm" style={styles.navbar}>
      <div className="container">

        {/* Logo */}
        <Link
          className="navbar-brand d-flex align-items-center fw-bold"
          to="/admin-dashboard"
          style={{ fontSize: "1.1rem", color: "#0f172a" }}
        >
          <div style={styles.logoIcon}>
            <img
              src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
              alt="Logo"
              style={{ width: "22px" }}
            />
          </div>
          <span className="ms-2">Cloudora</span>
        </Link>

        {/* Toggle */}
        <button
          className="navbar-toggler border-0 shadow-none"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Nav */}
        <div className="collapse navbar-collapse" id="navbarNav">

          <ul className="navbar-nav mx-auto" style={styles.navList}>

            <li className="nav-item">
              <Link
                to="/admin-dashboard"
                className="nav-link d-flex align-items-center"
                style={isActive("/admin-dashboard") ? styles.activeLink : styles.link}
              >
                <LayoutDashboard size={18} className="me-2" />
                Dashboard
              </Link>
            </li>

            <li className="nav-item">
              <Link
                to="/admin/create-user"
                className="nav-link d-flex align-items-center"
                style={isActive("/admin/create-user") ? styles.activeLink : styles.link}
              >
                <MessageSquareText size={18} className="me-2" />
                Create Admin
              </Link>
            </li>

<li className="nav-item">
              <Link
                to="/analytics"
                className="nav-link d-flex align-items-center"
                style={isActive("/analytics") ? styles.activeLink : styles.link}
              >
                <MessageSquareText size={18} className="me-2" />
                System Analytics
              </Link>
            </li>


            <li className="nav-item">
              <Link
                to="/about-admin"
                className="nav-link d-flex align-items-center"
                style={isActive("/about-admin") ? styles.activeLink : styles.link}
              >
                <Info size={18} className="me-2" />
                About
              </Link>
            </li>

          </ul>

          {/* Right */}
          <div className="d-flex align-items-center gap-3">

            <div style={styles.userCard}>
              <User size={16} />
              <span style={styles.userText}>Admin</span>
            </div>

            <div className="vr d-none d-lg-block" style={{ opacity: 0.1 }}></div>

            <button
              onClick={handleLogout}
              style={styles.logoutBtn}
              onMouseEnter={(e) => (e.currentTarget.style.background = "#fee2e2")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
            >
              <LogOut size={18} />
            </button>
          </div>

        </div>
      </div>
    </nav>
  );
}

const styles = {
  navbar: {
    background: "rgba(255, 255, 255, 0.7)",
    backdropFilter: "blur(16px)",
    borderBottom: "1px solid rgba(0,0,0,0.05)",
    padding: "0.6rem 0",
    fontFamily: "'Inter', sans-serif",
  },

  logoIcon: {
    width: "34px",
    height: "34px",
    backgroundColor: "#f1f5f9",
    borderRadius: "8px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  navList: {
    gap: "8px",
  },

  link: {
    color: "#64748b",
    fontSize: "0.95rem",
    fontWeight: "500",
    padding: "8px 14px",
    borderRadius: "10px",
  },

  activeLink: {
    color: "#4f46e5",
    backgroundColor: "#eef2ff",
    fontWeight: "600",
    padding: "8px 14px",
    borderRadius: "10px",
  },

  userCard: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    background: "#f8fafc",
    padding: "6px 10px",
    borderRadius: "10px",
    fontSize: "0.85rem",
    fontWeight: "500",
  },

  userText: {
    color: "#0f172a",
  },

  logoutBtn: {
    padding: "6px",
    borderRadius: "8px",
    border: "none",
    background: "transparent",
    cursor: "pointer",
  },
};

export default Navbar;