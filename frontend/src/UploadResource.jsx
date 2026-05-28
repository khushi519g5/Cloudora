import { useState, useEffect } from "react";
import axios from "axios";
import { Upload, FileText } from "lucide-react";

export default function UploadResource({ refreshResources }) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    subject: "",
    fileUrl: ""
  });

  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post("http://localhost:5000/api/resources/upload", {
        ...formData,
        uploadedBy: "admin123"
      });

      await axios.post("http://localhost:5000/api/activity", {
        message: `admin123 uploaded ${formData.title}`,
        type: "upload"
      });

      alert("Resource Uploaded Successfully!");

      setFormData({
        title: "",
        description: "",
        subject: "",
        fileUrl: ""
      });

      if (refreshResources) refreshResources();

    } catch (error) {
      console.error("Upload error:", error);
      alert("Error uploading resource");
    }
  };

  return (
    <div style={{ ...styles.card, padding: isMobile ? "18px" : "25px" }}>
      {/* HEADER */}
      <div style={styles.header}>
        <FileText size={18} />
        <h3 style={{ margin: 0 }}>Upload Resource</h3>
      </div>

      {/* FORM */}
      <form
        onSubmit={handleSubmit}
        style={{
          ...styles.form,
          gridTemplateColumns: isMobile
            ? "1fr"
            : "repeat(auto-fit, minmax(220px, 1fr))"
        }}
      >
        <input
          name="title"
          placeholder="Title"
          value={formData.title}
          onChange={handleChange}
          required
          style={styles.input}
        />

        <input
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
          style={styles.input}
        />

        <input
          name="subject"
          placeholder="Subject"
          value={formData.subject}
          onChange={handleChange}
          required
          style={styles.input}
        />

        <input
          name="fileUrl"
          placeholder="File URL (PDF only)"
          value={formData.fileUrl}
          onChange={handleChange}
          required
          style={styles.input}
        />

        <button
          type="submit"
          style={{
            ...styles.button,
            gridColumn: isMobile ? "auto" : "span 2",
            width: isMobile ? "100%" : "auto"
          }}
        >
          <Upload size={16} style={{ marginRight: 6 }} />
          Upload
        </button>
      </form>
    </div>
  );
}

/* ---------------- STYLES ---------------- */
const styles = {
  card: {
    backgroundColor: "rgba(255,255,255,0.95)",
    backdropFilter: "blur(10px)",
    borderRadius: "1.25rem",
    border: "1px solid #4f46e5",
    boxShadow: "0 10px 25px -5px rgba(0,0,0,0.05)",
    transition: "all 0.3s ease",
    maxWidth: "900px",
    margin: "20px auto",
    cursor: "pointer"
  },

  header: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    marginBottom: "20px",
    color: "#1e293b",
    fontWeight: 700
  },

  form: {
    display: "grid",
    gap: "15px"
  },

  input: {
    width: "100%",
    padding: "10px 14px",
    borderRadius: "0.75rem",
    border: "1px solid #e2e8f0",
    backgroundColor: "#fff",
    fontSize: "14px",
    outline: "none",
    transition: "all 0.3s ease"
  },

  button: {
    padding: "12px",
    borderRadius: "0.75rem",
    border: "none",
    cursor: "pointer",
    fontWeight: 600,
    color: "#fff",
    backgroundColor: "#4f46e5",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "all 0.3s ease"
  }
};