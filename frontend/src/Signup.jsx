import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;

export default function Signup() {
    console.log("Signup component rendered");
  const navigate = useNavigate();


  console.log("API_URL =", import.meta.env.VITE_API_URL);
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
    input: {
      width: "100%",
      padding: "0.75rem",
      marginBottom: "10px",
      borderRadius: "0.5rem",
      border: "1px solid #e2e8f0",
    },
    button: {
      width: "100%",
      padding: "0.75rem",
      backgroundColor: "#4f46e5",
      color: "white",
      border: "none",
      borderRadius: "0.5rem",
    },
  };

  return (
    <div style={styles.pageWrapper}>
      <div style={styles.card}>

        <h2>Create Account</h2>

        {error && <p style={{ color: "red" }}>{error}</p>}
        {success && <p style={{ color: "green" }}>{success}</p>}

        <form onSubmit={handleSubmit}>
          <input name="name" placeholder="Name" onChange={handleChange} style={styles.input} />
          <input name="email" placeholder="Email" onChange={handleChange} style={styles.input} />
          <input name="password" type="password" placeholder="Password" onChange={handleChange} style={styles.input} />

          <button type="submit" style={styles.button} disabled={loading}>
            {loading ? "Creating..." : "Sign Up"}
          </button>
        </form>

      </div>
    </div>
  );
}