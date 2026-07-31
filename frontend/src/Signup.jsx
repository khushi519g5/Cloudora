import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;

function Signup() {
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
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

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

  return (
  <>
    <h1 style={{color: "red", fontSize: "50px"}}>TEST123</h1>
    <div style={styles.pageWrapper}>
      <div style={styles.card}>
        <div className="text-center mb-4">
          <div style={styles.iconCircle}>
            <img src="/image.png" alt="Logo" style={{ width: "40px" }} />
          </div>
          <h3>Create Account</h3>
          <p>Join the Student Management System</p>
        </div>

        {error && (
          <div className="alert alert-danger" style={styles.alert}>
            {error}
          </div>
        )}

        {success && (
          <div className="alert alert-success" style={styles.alert}>
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-2">
            <input
              type="text"
              name="name"
              className="form-control"
              placeholder="Full Name"
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-2">
            <input
              type="email"
              name="email"
              className="form-control"
              placeholder="Email"
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <input
              type="password"
              name="password"
              className="form-control"
              placeholder="Password"
              onChange={handleChange}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn w-100 text-white"
            style={loading ? styles.buttonLoading : styles.button}
          >
            {loading ? "Signing up..." : "Sign Up"}
          </button>
          <div style={{ textAlign: "center", marginTop: "1rem", fontSize: "0.9rem" }}>
  Already have an account?{" "}
  <span
    style={{ color: "#4f46e5", cursor: "pointer", fontWeight: 500 }}
    onClick={() => navigate("/login")}
  >
    Login
  </span>
</div>
        </form>
      </div>
    </div>
    </>
  );
}

const styles = {
  pageWrapper: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8fafc",
    backgroundImage: `
      radial-gradient(at 0% 0%, hsla(253,16%,7%,1) 0, transparent 50%),
      radial-gradient(at 50% 0%, hsla(225,39%,30%,1) 0, transparent 50%)
    `,
    backgroundAttachment: "fixed",
  },

  card: {
    padding: "2.5rem",
    borderRadius: "1.25rem",
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    backdropFilter: "blur(10px)",
    boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
    width: "100%",
    maxWidth: "420px",
  },

  iconCircle: {
    width: "70px",
    height: "70px",
    backgroundColor: "#f1f5f9",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 auto 1rem auto",
  },

  input: {
    padding: "0.75rem 1rem",
    borderRadius: "0.5rem",
    border: "1px solid #e2e8f0",
    fontSize: "0.95rem",
    width: "100%",
    outline: "none",
    transition: "all 0.2s ease",
  },

  button: {
    backgroundColor: "#4f46e5",
    border: "none",
    borderRadius: "0.5rem",
    fontSize: "1rem",
    padding: "0.75rem",
    color: "white",
    width: "100%",
    cursor: "pointer",
    transition: "all 0.2s ease",
  },

  buttonLoading: {
    backgroundColor: "#818cf8",
    border: "none",
    borderRadius: "0.5rem",
    padding: "0.75rem",
    color: "white",
    width: "100%",
    cursor: "not-allowed",
  },

  alert: {
    borderRadius: "0.5rem",
    fontSize: "0.85rem",
    padding: "0.5rem 0.75rem",
  },
};

export default Signup;