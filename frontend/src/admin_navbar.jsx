import React from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  MessageSquareText,
  Info,
  LogOut,
  User,
  Users
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
      <div className="container-fluid px-3 px-md-4">
        
        {/* 🔹 Left Section: Logo */}
        <Link
          className="navbar-brand d-flex align-items-center fw-bold me-0"
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

        {/* 🔹 Mobile Toggle */}
        <button
          className="navbar-toggler border-0 shadow-none p-2"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon" style={{ width: "1.25rem", height: "1.25rem" }}></span>
        </button>

        {/* 🔹 Nav Content */}
        <div className="collapse navbar-collapse" id="navbarNav">
          
          {/* 🔹 Center Links Section */}
          <ul className="navbar-nav mx-auto my-3 my-lg-0 gap-1 gap-lg-2">
            <li className="nav-item">
              <Link
                to="/admin-dashboard"
                className="nav-link"
                style={isActive("/admin-dashboard") ? styles.activeLink : styles.link}
              >
                <LayoutDashboard size={18} className="me-2" />
                Dashboard
              </Link>
            </li>

            <li className="nav-item">
              <Link
                to="/admin/create-user"
                className="nav-link"
                style={isActive("/admin/create-user") ? styles.activeLink : styles.link}
              >
                <Users size={18} className="me-2" />
                Create Admin
              </Link>
            </li>

            <li className="nav-item">
              <Link
                to="/analytics"
                className="nav-link"
                style={isActive("/analytics") ? styles.activeLink : styles.link}
              >
                <MessageSquareText size={18} className="me-2" />
                System Analytics
              </Link>
            </li>

            <li className="nav-item">
              <Link
                to="/about-admin"
                className="nav-link"
                style={isActive("/about-admin") ? styles.activeLink : styles.link}
              >
                <Info size={18} className="me-2" />
                About
              </Link>
            </li>
          </ul>

          {/* 🔹 Right Section (User Card & Logout) */}
          <div className="d-flex align-items-center justify-content-between justify-content-lg-end gap-3 pt-3 pt-lg-0 border-top border-lg-0 mt-2 mt-lg-0">
            <div style={styles.userCard}>
              <User size={16} />
              <span style={styles.userText}>Admin</span>
            </div>

            <button
              onClick={handleLogout}
              style={styles.logoutBtn}
              className="btn d-flex align-items-center justify-content-center text-danger"
              onMouseEnter={(e) => (e.currentTarget.style.background = "#fee2e2")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
            >
              <LogOut size={18} />
              <span className="d-lg-none ms-2">Logout</span>
            </button>
          </div>

        </div>
      </div>
    </nav>
  );
}

const styles = {
  navbar: {
    background: "rgba(255, 255, 255, 0.8)",
    backdropFilter: "blur(12px)",
    WebkitBackdropFilter: "blur(12px)",
    borderBottom: "1px solid rgba(0,0,0,0.05)",
    padding: "0.5rem 0",
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
  link: {
    color: "#64748b",
    fontSize: "0.95rem",
    fontWeight: "500",
    padding: "10px 16px",
    borderRadius: "10px",
    transition: "all 0.2s ease",
    display: "flex",
    alignItems: "center",
  },
  activeLink: {
    color: "#4f46e5",
    backgroundColor: "#eef2ff",
    fontWeight: "600",
    padding: "10px 16px",
    borderRadius: "10px",
    display: "flex",
    alignItems: "center",
  },
  userCard: {
    display: "inline-flex",
    alignItems: "center",
    gap: "8px",
    background: "#f8fafc",
    padding: "8px 16px",
    borderRadius: "10px",
    fontSize: "0.85rem",
    fontWeight: "500",
  },
  userText: {
    color: "#0f172a",
  },
  logoutBtn: {
    padding: "10px",
    borderRadius: "10px",
    border: "none",
    background: "transparent",
    cursor: "pointer",
    transition: "all 0.2s ease",
    display: "flex",
    alignItems: "center",
    fontWeight: "500",
  },
};

export default Navbar;