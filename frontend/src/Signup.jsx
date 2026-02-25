import { useState } from "react";
import axios from "axios";

function Signup() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });
  
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
    setSuccess("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/signup",
        form
      );
      setSuccess("Signup successful! You can now log in.");
      setError("");
      console.log(res.data);
    } catch (err) {
      const message = err.response?.data?.message || "Signup failed. Try again.";
      setError(message);
      setSuccess("");
      console.error(message);
    }
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{
        minHeight: "100vh",
        width: "100vw",
        background: "linear-gradient(to right, #1e3c72, #2a5298)",
        fontFamily: "Arial, sans-serif"
      }}
    >
      <div
        className="card shadow-lg p-5 rounded-4"
        style={{
          maxWidth: "420px",
          width: "100%",
          backgroundColor: "#ffffff",
          transition: "transform 0.3s, box-shadow 0.3s"
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "translateY(-5px)";
          e.currentTarget.style.boxShadow = "0 20px 40px rgba(0,0,0,0.2)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "translateY(0)";
          e.currentTarget.style.boxShadow = "0 10px 20px rgba(0,0,0,0.1)";
        }}
      >
        {/* Logo & Title */}
        <div className="text-center mb-4">
          <img
            src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
            alt="Logo"
            style={{ width: "60px", marginBottom: "10px" }}
          />
          <h2 className="fw-bold text-primary mb-1">Student Portal</h2>
          <p className="text-secondary small">
            Sign up to access your resources
          </p>
        </div>

        {/* Display Error or Success */}
        {error && (
          <div className="alert alert-danger text-center py-2" role="alert">
            {error}
          </div>
        )}
        {success && (
          <div className="alert alert-success text-center py-2" role="alert">
            {success}
          </div>
        )}

        {/* Signup Form */}
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              className="form-control form-control-lg rounded-3 border-primary"
              onChange={handleChange}
              style={{
                transition: "box-shadow 0.3s",
              }}
              onFocus={(e) =>
                (e.currentTarget.style.boxShadow = "0 0 8px #1e3c72")
              }
              onBlur={(e) => (e.currentTarget.style.boxShadow = "none")}
              required
            />
          </div>
          <div className="mb-3">
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              className="form-control form-control-lg rounded-3 border-primary"
              onChange={handleChange}
              style={{
                transition: "box-shadow 0.3s",
              }}
              onFocus={(e) =>
                (e.currentTarget.style.boxShadow = "0 0 8px #1e3c72")
              }
              onBlur={(e) => (e.currentTarget.style.boxShadow = "none")}
              required
            />
          </div>
          <div className="mb-4">
            <input
              type="password"
              name="password"
              placeholder="Password"
              className="form-control form-control-lg rounded-3 border-primary"
              onChange={handleChange}
              style={{
                transition: "box-shadow 0.3s",
              }}
              onFocus={(e) =>
                (e.currentTarget.style.boxShadow = "0 0 8px #1e3c72")
              }
              onBlur={(e) => (e.currentTarget.style.boxShadow = "none")}
              required
            />
          </div>
          <button
            className="btn w-100 btn-lg shadow-sm text-white"
            style={{
              background: "linear-gradient(to right, #1e3c72, #2a5298)",
              transition: "background 0.3s, transform 0.2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.03)")}
            onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
          >
            Sign Up
          </button>
        </form>

        {/* Footer */}
        <p className="text-center mt-4 text-secondary">
          Already registered?{" "}
          <a
            href="/login"
            className="text-primary fw-semibold text-decoration-none"
          >
            Login here
          </a>
        </p>
      </div>
    </div>
  );
}

export default Signup;
