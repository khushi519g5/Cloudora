import { useState } from "react";
import axios from "axios";

export default function AdminCreateUser() {
  const token = localStorage.getItem("token"); // ✅ get token directly

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
      const res = await axios.post(
        "http://localhost:5000/api/admin/create-user",
        {
          name,
          email,
          password,
          role,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`, // ✅ correct header
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
        `❌ Error: ${err.response?.data?.message || "Failed to create user"}`
      );
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "auto" }}>
      <h1>Create User (Admin)</h1>

      {message && <p>{message}</p>}

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          style={{ display: "block", marginBottom: 10, width: "100%" }}
        />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{ display: "block", marginBottom: 10, width: "100%" }}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{ display: "block", marginBottom: 10, width: "100%" }}
        />

        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          style={{ display: "block", marginBottom: 10, width: "100%", padding: 8 }}
        >
          <option value="student">Student</option>
          <option value="admin">Admin</option>
           <option value="teacher">teacher</option>
        </select>

        <button type="submit" style={{ width: "100%" }}>
          Create User
        </button>
      </form>
    </div>
  );
}