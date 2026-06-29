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

    const payload = JSON.parse(atob(token.split('.')[1]));
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
    <div className="container-fluid" style={styles.pageWrapper}>
      <div className="row justify-content-center w-100">
        <div className="col-11 col-sm-8 col-md-6 col-lg-4">
          <div className="card border-0 shadow-sm" style={styles.card}>
            
            {/* Header Section */}
            <div className="text-center mb-5">
              <div style={styles.iconCircle}>
                <img 
  src="/image.png" 
  alt="Logo" 
  style={{ width: "40px" }} 
/>
              </div>
              <h3 className="fw-bold text-dark mt-3">Create Account</h3>
              <p className="text-muted small">Join the Student Management System</p>
            </div>

            {/* Status Messages */}
            {error && <div className="alert alert-danger border-0 small py-2 mb-4" style={styles.alert}>{error}</div>}
            {success && <div className="alert alert-success border-0 small py-2 mb-4" style={styles.alert}>{success}</div>}

          
             <form onSubmit={handleSubmit}>
    {/* 1. Stacked elements with minimal margin (mb-2) */}
    <div className="mb-2">
      <input
        type="text"
        name="name"
        className="form-control"
        style={styles.input}
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
        style={styles.input}
        placeholder="Email Address"
        onChange={handleChange}
        required
      />
    </div>

    <div className="mb-3">
      <input
        type="password"
        name="password"
        className="form-control"
        style={styles.input}
        placeholder="Password"
        onChange={handleChange}
        required
      />
    </div>

    <button
      type="submit"
      disabled={loading}
      className="btn w-100 py-2 fw-bold text-white shadow-sm"
      style={loading ? styles.buttonLoading : styles.button}
    >
      {loading ? (
        <span className="spinner-border spinner-border-sm me-2" role="status"></span>
      ) : "Sign Up"} 
    </button>
  </form>

  {/* Footer: Tightened margin */}
  <div className="text-center mt-3">
    <p className="text-muted small mb-0">
      Already have an account? <a href="/login" className="fw-bold text-decoration-none" style={{color: '#4f46e5'}}>Log in</a>
    </p>
  </div>
</div>
          <div className="text-center mt-4">
            <p className="text-muted small" style={{opacity: 0.7}}>© 2026 Student Management System</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Exactly the same styles as Login for visual consistency
const styles = {
  pageWrapper: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    backgroundColor: "#f8fafc", // Light slate gray background
    backgroundImage: `radial-gradient(at 0% 0%, hsla(253,16%,7%,1) 0, transparent 50%), 
                      radial-gradient(at 50% 0%, hsla(225,39%,30%,1) 0, transparent 50%)`,
    backgroundAttachment: "fixed"
  },
  card: {
    padding: "2.5rem",
    borderRadius: "1.25rem",
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    backdropFilter: "blur(10px)"
  },
  iconCircle: {
    width: "70px",
    height: "70px",
    backgroundColor: "#f1f5f9",
    borderRadius: "50%",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 auto"
  },
  input: {
    padding: "0.75rem 1rem",
    borderRadius: "0.5rem",
    border: "1px solid #e2e8f0",
    fontSize: "0.95rem",
    transition: "all 0.2s ease"
  },
  button: {
    backgroundColor: "#4f46e5", // Modern Indigo
    border: "none",
    borderRadius: "0.5rem",
    fontSize: "1rem",
    transition: "transform 0.1s ease, background-color 0.2s ease"
  },
  buttonLoading: {
    backgroundColor: "#818cf8",
    border: "none",
    borderRadius: "0.5rem"
  },
  alert: {
    borderRadius: "0.5rem",
    fontSize: "0.85rem"
  }
};

export default Signup;