import { useState } from "react";
import axios from "axios";
import { UserPlus, ShieldCheck } from "lucide-react";
import Navbar from "./admin_navbar";
const API_URL = import.meta.env.VITE_API_URL;

export default function AdminCreateUser() {
  const token = localStorage.getItem("token");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token) {
      setMessage("❌ No token found. Please login again.");
      return;
    }

    try {
      await axios.post(
        `${API_URL}/api/admin/create-user`,
        {
          name,
          email,
          password,
          role,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage(`✅ User created successfully as ${role}!`);

      setName("");
      setEmail("");
      setPassword("");
      setRole("student");

    } catch (err) {
      setMessage(
        `❌ Error: ${
          err.response?.data?.message || "Failed to create user"
        }`
      );
    }
  };

  return (
    <div style={styles.page}>
      <Navbar />

      <div style={styles.container}>
        {/* HERO SECTION */}
        <div style={styles.heroCard}>
          <div>
            <div style={styles.badge}>
              <ShieldCheck size={14} />
              <span style={{ marginLeft: 6 }}>Admin Access</span>
            </div>

            <h1 style={styles.title}>Create New User</h1>

            <p style={styles.description}>
              Add students, teachers, or administrators to the platform securely.
            </p>
          </div>

          <div style={styles.heroIcon}>
            <UserPlus size={50} color="#4f46e5" />
          </div>
        </div>

        {/* FORM CARD */}
        <div style={styles.formCard}>
          <h2 style={styles.formHeading}>User Information</h2>

          {message && (
            <div
              style={{
                ...styles.messageBox,
                backgroundColor: message.includes("✅")
                  ? "#ecfdf5"
                  : "#fef2f2",
                color: message.includes("✅")
                  ? "#166534"
                  : "#b91c1c",
                border: message.includes("✅")
                  ? "1px solid #bbf7d0"
                  : "1px solid #fecaca",
              }}
            >
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Full Name</label>

              <input
                type="text"
                placeholder="Enter full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                style={styles.input}
              />
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Email Address</label>

              <input
                type="email"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={styles.input}
              />
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Password</label>

              <input
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={styles.input}
              />
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Role</label>

              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                style={styles.select}
              >
                <option value="student">Student</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <button
              type="submit"
              style={styles.submitBtn}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow =
                  "0 10px 20px rgba(79,70,229,0.3)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              Create User
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    backgroundColor: "#f8fafc",
    backgroundImage: `
      radial-gradient(at 0% 0%, hsla(253,16%,7%,1) 0, transparent 50%),
      radial-gradient(at 50% 0%, hsla(225,39%,30%,1) 0, transparent 50%)
    `,
    backgroundAttachment: "fixed",
    paddingBottom: "50px",
    fontFamily: "'Inter', sans-serif",
  },

  container: {
    maxWidth: "900px",
    margin: "0 auto",
    padding: "30px 20px",
  },

  heroCard: {
    backgroundColor: "rgba(255,255,255,0.95)",
    backdropFilter: "blur(10px)",
    borderRadius: "1.5rem",
    padding: "35px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "30px",
    border: "1px solid rgba(255,255,255,0.3)",
    boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
  },

  badge: {
    display: "inline-flex",
    alignItems: "center",
    backgroundColor: "#eef2ff",
    color: "#4f46e5",
    padding: "6px 14px",
    borderRadius: "999px",
    fontSize: "12px",
    fontWeight: "600",
    marginBottom: "15px",
  },

  title: {
    fontSize: "36px",
    fontWeight: "800",
    color: "#1e293b",
    marginBottom: "10px",
  },

  description: {
    color: "#64748b",
    fontSize: "16px",
    maxWidth: "500px",
    lineHeight: 1.6,
  },

  heroIcon: {
    width: "120px",
    height: "120px",
    borderRadius: "50%",
    background:
      "linear-gradient(135deg, rgba(79,70,229,0.1), rgba(99,102,241,0.15))",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  formCard: {
    backgroundColor: "#fff",
    borderRadius: "1.5rem",
    padding: "35px",
    boxShadow: "0 15px 30px rgba(0,0,0,0.06)",
    border: "1px solid #e2e8f0",
  },

  formHeading: {
    fontSize: "24px",
    fontWeight: "700",
    color: "#1e293b",
    marginBottom: "25px",
  },

  inputGroup: {
    marginBottom: "20px",
  },

  label: {
    display: "block",
    marginBottom: "8px",
    fontWeight: "600",
    color: "#334155",
    fontSize: "14px",
  },

  input: {
    width: "100%",
    padding: "14px 16px",
    borderRadius: "0.8rem",
    border: "1px solid #cbd5e1",
    outline: "none",
    fontSize: "15px",
    transition: "0.25s",
    boxSizing: "border-box",
  },

  select: {
    width: "100%",
    padding: "14px 16px",
    borderRadius: "0.8rem",
    border: "1px solid #cbd5e1",
    outline: "none",
    fontSize: "15px",
    backgroundColor: "#fff",
    boxSizing: "border-box",
  },

  submitBtn: {
    width: "100%",
    padding: "15px",
    borderRadius: "0.9rem",
    border: "none",
    background: "linear-gradient(135deg, #4f46e5, #6366f1)",
    color: "#fff",
    fontWeight: "700",
    fontSize: "15px",
    cursor: "pointer",
    transition: "all 0.25s ease",
    marginTop: "10px",
  },

  messageBox: {
    padding: "14px",
    borderRadius: "0.8rem",
    marginBottom: "20px",
    fontWeight: "600",
    fontSize: "14px",
  },
};