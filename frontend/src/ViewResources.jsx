import { useEffect, useState } from "react";
import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL;

export default function ViewResources({
  resources,
  setResources,
  selectedResources,
  handleSelectResource,
  refreshResources
}) {

  const [editId, setEditId] = useState(null);
  const [formData, setFormData] = useState({ title: "", description: "", subject: "" });

  const handleDelete = async (id) => {
    try {
   await axios.delete(`${API_URL}/api/resources/${id}`);
      setResources(resources.filter((r) => r._id !== id));
    } catch (error) { console.error(error); }
  };

  const handleEdit = (resource) => {
    setEditId(resource._id);
    setFormData({
      title: resource.title,
      description: resource.description,
      subject: resource.subject,
    });
  };

  const handleUpdate = async (id) => {
    try {
      const res = await axios.put(`${API_URL}/api/resources/${id}`, formData);
      setResources(resources.map((r) => (r._id === id ? res.data : r)));
      setEditId(null);
    } catch (error) { console.error(error); }
  };

  return (
    <div>
      {resources.length === 0 ? (
        <div style={styles.emptyState}>
          <h3>No Resources Yet 📭</h3>
          <p>Start uploading study materials to see them here.</p>
        </div>
      ) : (
        <div style={styles.grid}>
          {resources.map((r) => (
            <div
  key={r._id}
  style={{
    ...styles.card,
    border: selectedResources.includes(r._id)
      ? "2px solid #10b981"
      : styles.card.border,
  }}
  onMouseEnter={(e) => {
    e.currentTarget.style.transform = "translateY(-8px)";
    e.currentTarget.style.boxShadow = "0 14px 30px rgba(59,130,246,0.25)";
  }}
  onMouseLeave={(e) => {
    e.currentTarget.style.transform = "translateY(0)";
    e.currentTarget.style.boxShadow = "none";
  }}
>
              {/* Checkbox + Preview */}
              <input
                type="checkbox"
                checked={selectedResources.includes(r._id)}
                onChange={() => handleSelectResource(r._id)}
                style={{ position: "absolute", top: "15px", right: "15px" }}
              />

              {r.fileType?.startsWith("image") && (
                <img
                  src={r.fileUrl}
                  alt={r.title}
                  style={{ width: "100%", borderRadius: "12px", marginBottom: "15px" }}
                />
              )}

              <div style={styles.iconBadge}>📘</div>

              {editId === r._id ? (
                <>
                  <input
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    style={styles.input}
                  />
                  <input
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    style={styles.input}
                  />
                  <input
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    style={styles.input}
                  />
                  <button style={styles.saveBtn} onClick={() => handleUpdate(r._id)}>
                    💾 Save Changes
                  </button>
                </>
              ) : (
                <>
                  <h3 style={styles.title}>{r.title}</h3>
                  <p style={styles.desc}>{r.description}</p>
                  <p style={styles.subject}>
                    <span style={{ color: "#60a5fa" }}>Subject:</span> {r.subject}
                  </p>
                  <a href={r.fileUrl} target="_blank" rel="noreferrer" style={styles.openBtn}>
                    Open Resource
                  </a>
                  <div style={styles.buttonRow}>
                    <button style={styles.editBtn} onClick={() => handleEdit(r)}>
                      ✏️ Update
                    </button>
                    <button style={styles.deleteBtn} onClick={() => handleDelete(r._id)}>
                      🗑 Delete
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
              
const styles = {
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "30px"
  },

  card: {
  background: "linear-gradient(135deg, #1e3a8a, #1e293b)",
  padding: "35px",
  borderRadius: "22px",
  border: "1px solid rgba(255,255,255,0.08)",
  transition: "all 0.3s ease",
  position: "relative",
  cursor: "pointer",
},

  iconBadge: {
    width: "55px",
    height: "55px",
    borderRadius: "16px",
    background: "#2563eb",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "24px",
    marginBottom: "20px",
    boxShadow: "0 8px 20px rgba(0,0,0,0.3)"
  },

  title: {
    fontSize: "20px",
    marginBottom: "10px",
    color: "white"
  },

  desc: {
    color: "#cbd5e1",
    marginBottom: "15px"
  },

  subject: {
    color: "#94a3b8",
    marginBottom: "25px"
  },

  openBtn: {
     display: "block",
  width: "100%",
  textAlign: "center",
    padding: "10px 22px",
    borderRadius: "12px",
    textDecoration: "none",
    background: "linear-gradient(135deg, #3b82f6, #2563eb)",
    color: "white",
    fontWeight: "600",
   boxShadow: "0 6px 18px rgba(245,158,11,0.4)",
    transition: "0.3s"
  },buttonRow: {
  marginTop: "25px",
  display: "flex",
  gap: "15px",
},


editBtn: {
  flex: 1,
  padding: "10px 0",
  borderRadius: "12px",
  border: "none",
  cursor: "pointer",
  fontWeight: "600",
  color: "white",
  background: "linear-gradient(135deg, #0ba7f5, #2206d9)",
  boxShadow: "0 6px 18px rgba(245,158,11,0.4)",
  transition: "all 0.2s ease",
},

deleteBtn: {
  flex: 1,
  padding: "10px 0",
  borderRadius: "12px",
  border: "none",
  cursor: "pointer",
  fontWeight: "600",
  color: "white",
  background: "linear-gradient(135deg, #ef4444, #dc2626)",
  boxShadow: "0 6px 18px rgba(239,68,68,0.4)",
  transition: "all 0.2s ease",
},

saveBtn: {
  marginTop: "15px",
  width: "100%",
  padding: "12px",
  borderRadius: "12px",
  border: "none",
  cursor: "pointer",
  fontWeight: "600",
  color: "white",
  background: "linear-gradient(135deg, #10b981, #059669)",
 boxShadow: "0 6px 18px rgba(245,158,11,0.35)",
  transition: "all 0.2s ease",
},

input: {
  width: "100%",
  padding: "10px 12px",
  marginBottom: "12px",
  borderRadius: "10px",
  border: "1px solid rgba(255,255,255,0.1)",
  background: "rgba(255,255,255,0.05)",
  color: "white",
  outline: "none",
  fontSize: "14px",
},

  emptyState: {
    textAlign: "center",
    padding: "60px",
    background: "rgba(30, 58, 138, 0.2)",
    borderRadius: "20px",
    border: "1px solid rgba(255,255,255,0.08)",
    color: "#94a3b8"
  }
};