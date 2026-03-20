import { useState } from "react";
import axios from "axios";

export default function UploadResource({ refreshResources }) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    subject: "",
    fileUrl: ""
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/resources/upload", {
        ...formData,
        uploadedBy: "admin123" // later replace with real user id
      });

      alert("Resource Uploaded Successfully!");

      setFormData({
        title: "",
        description: "",
        subject: "",
        fileUrl: ""
      });

      refreshResources();
    } catch (error) {
      console.error(error);
      alert("Error uploading resource");
    }
  };

  return (
    <div className="upload-container">
      <form className="upload-form" onSubmit={handleSubmit}>
        <input
          className="upload-input"
          name="title"
          placeholder="Title"
          value={formData.title}
          onChange={handleChange}
          required
        />
        <input
          className="upload-input"
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
        />
        <input
          className="upload-input"
          name="subject"
          placeholder="Subject"
          value={formData.subject}
          onChange={handleChange}
          required
        />
        <input
          className="upload-input"
          name="fileUrl"
          placeholder="File URL (temporary)"
          value={formData.fileUrl}
          onChange={handleChange}
          required
        />
        <button type="submit" className="upload-button">Upload</button>
      </form>

      {/* Inline CSS */}
      <style>{`
  .upload-form {
    display: flex;
    gap: 18px;
    align-items: center;
    flex-wrap: wrap;
  }

  .upload-input {
    padding: 10px 14px;
    border-radius: 12px;
    border: 1px solid rgba(255,255,255,0.1);
    background: rgba(255,255,255,0.05);
    color: white;
    outline: none;
    transition: all 0.2s ease;
    flex: 1;
    backdrop-filter: blur(10px);
  }

  .upload-input::placeholder {
    color: #94a3b8;
  }

  .upload-input:focus {
    border-color: #3b82f6;
    box-shadow: 0 0 15px rgba(59,130,246,0.4);
  }

  .upload-button {
    padding: 10px 22px;
    border-radius: 12px;
    border: none;
    cursor: pointer;
    font-weight: 600;
    color: white;
    background: linear-gradient(135deg, #3b82f6, #2563eb);
    box-shadow: 0 6px 18px rgba(59,130,246,0.4);
    transition: all 0.2s ease;
  }

  .upload-button:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 25px rgba(59,130,246,0.6);
  }
`}</style>
    </div>
  );
}