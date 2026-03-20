import { useState, useEffect } from "react";
import UploadResource from "./UploadResource";
import axios from "axios";
import admin from "./assets/admin.png";

export default function AdminDashboard() {
  const [resources, setResources] = useState([]);
  const [selectedResources, setSelectedResources] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  // FETCH RESOURCES
  const refreshResources = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/resources");
      setResources(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    refreshResources();
  }, []);

  // BULK SELECT
  const handleSelectResource = (id) => {
    setSelectedResources((prev) =>
      prev.includes(id) ? prev.filter((r) => r !== id) : [...prev, id]
    );
  };

  // DELETE SINGLE RESOURCE
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Do you really want to delete this resource?");
    if (!confirmDelete) return;

    try {
      await axios.delete(`http://localhost:5000/api/resources/${id}`);
      setResources(resources.filter((r) => r._id !== id));
      setSelectedResources((prev) => prev.filter((r) => r !== id));
    } catch (error) {
      console.error(error);
    }
  };

  // DELETE BULK RESOURCES
  const handleBulkDelete = async () => {
    const confirmDelete = window.confirm(`Do you really want to delete ${selectedResources.length} resources?`);
    if (!confirmDelete) return;

    try {
      await Promise.all(selectedResources.map((id) => axios.delete(`http://localhost:5000/api/resources/${id}`)));
      setResources(resources.filter((r) => !selectedResources.includes(r._id)));
      setSelectedResources([]);
    } catch (error) {
      console.error(error);
    }
  };

  // FILTER RESOURCES (safe fallback for title)
  const filteredResources = resources.filter((r) =>
    (r.title || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div style={styles.page}>
      {/* NAVBAR */}
      <div style={styles.navbar}>
        <div style={styles.logo}>
          <img src={admin} alt="admin" style={{ width: "70px", marginRight: "10px" }} />
          Admin Panel
        </div>
      </div>

      {/* HERO */}
      <div style={styles.hero}>
        <p style={styles.subtitle}>Administrator Access</p>
        <h1 style={styles.title}>Manage Platform Resources</h1>
        <p style={styles.description}>
          Upload, organize and control all learning materials from one place.
        </p>
      </div>

      {/* STATS */}
      <div style={styles.statsRow}>
        <div style={styles.statCard}>
          <div style={styles.statTop}>
            <div style={{ ...styles.statIcon, background: "#1e40af" }}>📚</div>
            <div>
              <p style={styles.statTitle}>Total Resources</p>
              <h2>{resources.length}</h2>
            </div>
          </div>
        </div>

        <div style={styles.statCard}>
          <div style={styles.statTop}>
            <div style={{ ...styles.statIcon, background: "#059669" }}>⬆️</div>
            <div>
              <p style={styles.statTitle}>Recent Uploads</p>
              <h2>
                {resources.filter(
                  (r) =>
                    new Date(r.createdAt) >
                    new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
                ).length}
              </h2>
            </div>
          </div>
        </div>

        <div style={styles.statCard}>
          <div style={styles.statTop}>
            <div style={{ ...styles.statIcon, background: "#f59e0b" }}>💾</div>
            <div>
              <p style={styles.statTitle}>Selected</p>
              <h2>{selectedResources.length}</h2>
            </div>
          </div>
        </div>
      </div>

      {/* UPLOAD SECTION */}
      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>Upload New Resource</h2>
        <UploadResource refreshResources={refreshResources} />
      </div>

      {/* SEARCH + BULK DELETE */}
      <div style={{ marginBottom: "20px", display: "flex", gap: "15px", alignItems: "center" }}>
        <input
          type="text"
          placeholder="Search resources..."
          style={styles.searchInput}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        {selectedResources.length > 0 && (
          <button style={styles.bulkDeleteBtn} onClick={handleBulkDelete}>
            🗑 Delete Selected ({selectedResources.length})
          </button>
        )}
      </div>

      {/* VIEW RESOURCES */}
      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>All Resources</h2>
        {filteredResources.length === 0 ? (
          <div style={styles.emptyState}>
            <h3>No Resources Found 📭</h3>
          </div>
        ) : (
          <div style={styles.grid}>
            {filteredResources.map((r) => (
              <ResourceCard
                key={r._id}
                resource={r}
                editId={null}
                setResources={setResources}
                selectedResources={selectedResources}
                handleSelectResource={handleSelectResource}
                handleDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ------------------ RESOURCE CARD ------------------
function ResourceCard({ resource, selectedResources, handleSelectResource, handleDelete }) {
  const [editId, setEditId] = useState(null);
  const [formData, setFormData] = useState({
    title: resource.title,
    description: resource.description,
    subject: resource.subject,
  });

  const handleEdit = () => setEditId(resource._id);
  const handleUpdate = async () => {
    try {
      const res = await axios.put(
        `http://localhost:5000/api/resources/${resource._id}`,
        formData
      );
      // Update resource in page
      window.location.reload(); // optional, can improve later
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div
      style={{
        ...styles.card,
        border: selectedResources.includes(resource._id)
          ? "2px solid #10b981"
          : styles.card.border,
      }}
    >
      <input
        type="checkbox"
        checked={selectedResources.includes(resource._id)}
        onChange={() => handleSelectResource(resource._id)}
        style={{ position: "absolute", top: "15px", right: "15px" }}
      />

      {/* PREVIEW */}
      {resource.fileType?.startsWith("image") && (
        <img
          src={resource.fileUrl}
          alt={resource.title}
          style={{ width: "100%", borderRadius: "12px", marginBottom: "15px" }}
        />
      )}

      <div style={styles.iconBadge}>📘</div>

      {editId === resource._id ? (
        <>
          <input
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            style={styles.input}
          />
          <input
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            style={styles.input}
          />
          <input
            value={formData.subject}
            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
            style={styles.input}
          />
          <button style={styles.saveBtn} onClick={handleUpdate}>
            💾 Save Changes
          </button>
        </>
      ) : (
        <>
          <h3 style={styles.title}>{resource.title}</h3>
          <p style={styles.desc}>{resource.description}</p>
          <p style={styles.subject}>
            <span style={{ color: "#60a5fa" }}>Subject:</span> {resource.subject}
          </p>
          <a href={resource.fileUrl} target="_blank" rel="noreferrer" style={styles.openBtn}>
            Open Resource
          </a>
          <div style={styles.buttonRow}>
            <button style={styles.editBtn} onClick={handleEdit}>
              ✏️ Update
            </button>
            <button style={styles.deleteBtn} onClick={() => handleDelete(resource._id)}>
              🗑 Delete
            </button>
          </div>
        </>
      )}
    </div>
  );
}

// ------------------ STYLES ------------------
const styles = {
  page: {
    minHeight: "100vh",
    padding: "60px 80px",
    fontFamily: "Poppins, sans-serif",
    color: "#ffffff",
    background: `
      radial-gradient(circle at 20% 20%, #1e40af40 0%, transparent 40%),
      radial-gradient(circle at 80% 80%, #2563eb30 0%, transparent 40%),
      linear-gradient(270deg, #1e3a8a, #1e293b, #0f172a)
    `,
    backgroundSize: "400% 400%",
    animation: "gradientMove 18s ease infinite",
    maxWidth: "100%",
    margin: "0 auto",
  },
  navbar: { display: "flex", justifyContent: "space-between", marginBottom: "50px" },
  logo: { fontSize: "22px", fontWeight: "600" },
  hero: {
    background: "rgba(30, 58, 138, 0.25)",
    backdropFilter: "blur(20px)",
    padding: "50px",
    borderRadius: "20px",
    border: "1px solid rgba(255,255,255,0.08)",
    marginBottom: "50px",
    boxShadow: "0 10px 40px rgba(37, 99, 235, 0.15)",
  },
  subtitle: { color: "#60a5fa", opacity: 0.85, marginBottom: "10px" },
  title: { fontSize: "44px", letterSpacing: "-0.5px", marginBottom: "15px", fontWeight: "700" },
  description: { color: "#94a3b8", maxWidth: "600px" },
  statsRow: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "25px", marginBottom: "60px" },
  statCard: { background: "rgba(255,255,255,0.05)", padding: "35px", borderRadius: "20px", border: "1px solid rgba(255,255,255,0.1)", backdropFilter: "blur(20px)", transition: "0.3s", cursor: "pointer", textAlign: "center", boxShadow: "0 8px 40px rgba(0,0,0,0.4)" },
  statTop: { display: "flex", alignItems: "center", gap: "18px" },
  statIcon: { width: "55px", height: "55px", borderRadius: "16px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "24px" },
  statTitle: { color: "#94a3b8", marginBottom: "8px" },
  section: { background: "rgba(30, 58, 138, 0.15)", padding: "40px", borderRadius: "20px", border: "1px solid rgba(255,255,255,0.08)", marginBottom: "50px", boxShadow: "0 10px 40px rgba(0,0,0,0.3)" },
  sectionTitle: { marginBottom: "25px" },
  searchInput: { width: "100%", padding: "12px 20px", borderRadius: "12px", border: "1px solid #94a3b8", outline: "none", fontSize: "16px", background: "rgba(255,255,255,0.05)", color: "#fff", backdropFilter: "blur(10px)" },
  bulkDeleteBtn: { padding: "10px 20px", borderRadius: "12px", border: "none", cursor: "pointer", fontWeight: "600", background: "linear-gradient(135deg, #ef4444, #dc2626)", color: "white" },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "30px" },
  card: { background: "linear-gradient(135deg, #1e3a8a, #1e293b)", padding: "35px", borderRadius: "22px", border: "1px solid rgba(255,255,255,0.08)", transition: "all 0.3s ease", position: "relative" },
  iconBadge: { width: "55px", height: "55px", borderRadius: "16px", background: "#2563eb", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "24px", marginBottom: "20px", boxShadow: "0 8px 20px rgba(0,0,0,0.3)" },
  title: { fontSize: "20px", marginBottom: "10px", color: "white" },
  desc: { color: "#cbd5e1", marginBottom: "15px" },
  subject: { color: "#94a3b8", marginBottom: "25px" },
  openBtn: { display: "block", width: "100%", textAlign: "center", padding: "10px 22px", borderRadius: "12px", textDecoration: "none", background: "linear-gradient(135deg, #3b82f6, #2563eb)", color: "white", fontWeight: "600", boxShadow: "0 6px 18px rgba(245,158,11,0.4)", transition: "0.3s" },
  buttonRow: { marginTop: "25px", display: "flex", gap: "15px" },
  editBtn: { flex: 1, padding: "10px 0", borderRadius: "12px", border: "none", cursor: "pointer", fontWeight: "600", color: "white", background: "linear-gradient(135deg, #0ba7f5, #2206d9)", boxShadow: "0 6px 18px rgba(245,158,11,0.4)", transition: "all 0.2s ease" },
  deleteBtn: { flex: 1, padding: "10px 0", borderRadius: "12px", border: "none", cursor: "pointer", fontWeight: "600", color: "white", background: "linear-gradient(135deg, #ef4444, #dc2626)", boxShadow: "0 6px 18px rgba(239,68,68,0.4)", transition: "all 0.2s ease" },
  saveBtn: { marginTop: "15px", width: "100%", padding: "12px", borderRadius: "12px", border: "none", cursor: "pointer", fontWeight: "600", color: "white", background: "linear-gradient(135deg, #10b981, #059669)", boxShadow: "0 6px 18px rgba(245,158,11,0.35)", transition: "all 0.2s ease" },
  input: { width: "100%", padding: "10px 12px", marginBottom: "12px", borderRadius: "10px", border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.05)", color: "white", outline: "none", fontSize: "14px" },
  emptyState: { textAlign: "center", padding: "60px", background: "rgba(30, 58, 138, 0.2)", borderRadius: "20px", border: "1px solid rgba(255,255,255,0.08)", color: "#94a3b8" },
};