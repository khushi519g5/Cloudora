import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
    setSuccess("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/login",
        form
      );

      const token = res.data.token;
      localStorage.setItem("token", token);

      // Decode token to get role
      const payload = JSON.parse(atob(token.split('.')[1]));
      const role = payload.role;

      setSuccess("Login successful! Redirecting...");
      setError("");

      setTimeout(() => {
        if (role === "admin") navigate("/admin-dashboard");
        else if (role === "teacher") navigate("/teacher-dashboard");
        else navigate("/student-dashboard");
      }, 1000);

    } catch (err) {
      const message =
        err.response?.data?.message || "Login failed. Try again.";
      setError(message);
      setSuccess("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{
        minHeight: "100vh",
        width: "100vw",
        background: "linear-gradient(to right, #1e3c72, #2a5298)",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div
        className="card shadow-lg p-5 rounded-4"
        style={{
          maxWidth: "420px",
          width: "100%",
          backgroundColor: "#ffffff",
          transition: "transform 0.3s, box-shadow 0.3s",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "translateY(-5px)";
          e.currentTarget.style.boxShadow =
            "0 20px 40px rgba(0,0,0,0.2)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "translateY(0)";
          e.currentTarget.style.boxShadow =
            "0 10px 20px rgba(0,0,0,0.1)";
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
            Login to access your dashboard
          </p>
        </div>

        {/* Alerts */}
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

        {/* Login Form */}
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              className="form-control form-control-lg rounded-3 border-primary"
              onChange={handleChange}
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
              onFocus={(e) =>
                (e.currentTarget.style.boxShadow = "0 0 8px #1e3c72")
              }
              onBlur={(e) => (e.currentTarget.style.boxShadow = "none")}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn w-100 btn-lg shadow-sm text-white"
            style={{
              background: "linear-gradient(to right, #1e3c72, #2a5298)",
              transition: "background 0.3s, transform 0.2s",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.transform = "scale(1.03)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.transform = "scale(1)")
            }
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {/* Footer */}
        <p className="text-center mt-4 text-secondary">
          Don’t have an account?{" "}
          <a
            href="/signup"
            className="text-primary fw-semibold text-decoration-none"
          >
            Sign up here
          </a>
        </p>
      </div>
    </div>
  );
}

export default Login;
