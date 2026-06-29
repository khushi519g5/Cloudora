import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;

export default function Signup() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post(
        `${API_URL}/api/auth/signup`,
        form
      );

      const token = res.data.token;
      localStorage.setItem("token", token);

      const payload = JSON.parse(atob(token.split(".")[1]));
      const role = payload.role;

      setSuccess("Account created! Redirecting...");

      setTimeout(() => {
        if (role === "admin") navigate("/admin-dashboard");
        else if (role === "teacher") navigate("/teacher-dashboard");
        else navigate("/student-dashboard");
      }, 1000);

    } catch (err) {
      setError(err.response?.data?.message || "Signup failed.");
    } finally {
      setLoading(false);
    }
  };

  const styles = {
    pageWrapper: {
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "#f8fafc",
      backgroundImage: `
        radial-gradient(at 0% 0%, hsla(253,16%,7%,1) 0, transparent 50%),
        radial-gradient(at 50% 0%, hsla(225,39%,30%,1) 0, transparent 50%)
      `,
      backgroundAttachment: "fixed",
    },
    card: {
      width: "400px",
      padding: "2.5rem",
      borderRadius: "1.25rem",
      backgroundColor: "rgba(255, 255, 255, 0.95)",
      backdropFilter: "blur(10px)",
      boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
    },
    iconCircle: {
      width: "70px",
      height: "70px",
      backgroundColor: "#f1f5f9",
      borderRadius: "50%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      margin: "0 auto 10px auto",
    },
    input: {
      padding: "0.75rem 1rem",
      borderRadius: "0.5rem",
      border: "1px solid #e2e8f0",
      fontSize: "0.95rem",
      width: "100%",
      marginBottom: "10px",
    },
    button: {
      width: "100%",
      padding: "0.75rem",
      backgroundColor: "#4f46e5",
      border: "none",
      borderRadius: "0.5rem",
      color: "white",
      fontWeight: "bold",
      cursor: "pointer",
    },
    buttonLoading: {
      width: "100%",
      padding: "0.75rem",
      backgroundColor: "#818cf8",
      border: "none",
      borderRadius: "0.5rem",
      color: "white",
      cursor: "not-allowed",
    },
    alert: {
      borderRadius: "0.5rem",
      fontSize: "0.85rem",
      padding: "8px",
      marginBottom: "10px",
    },
  };

  return (
    <div style={styles.pageWrapper}>
      <div style={styles.card}>

        {/* Header */}
        <div className="text-center mb-4">
          <div style={styles.iconCircle}>
            <img
              src="/image.png"
              alt="Logo"
              style={{ width: "40px" }}
            />
          </div>

          <h2>Create Account</h2>
          <p>Join the Student Management System</p>
        </div>

        {/* Messages */}
        {error && (
          <div style={{ ...styles.alert, background: "#fee2e2", color: "#b91c1c" }}>
            {error}
          </div>
        )}

        {success && (
          <div style={{ ...styles.alert, background: "#dcfce7", color: "#166534" }}>
            {success}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            onChange={handleChange}
            style={styles.input}
            required
          />

          <input
            type="email"
            name="email"
            placeholder="Email Address"
            onChange={handleChange}
            style={styles.input}
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
            style={styles.input}
            required
          />

          <button
            type="submit"
            disabled={loading}
            style={loading ? styles.buttonLoading : styles.button}
          >
            {loading ? "Creating..." : "Sign Up"}
          </button>
        </form>

      </div>
    </div>
  );
}
