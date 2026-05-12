import React from "react";
import Navbar from "./Navbar";

const AboutAdmin = () => {
  return (
    <div style={styles.page}>
      <Navbar />

      <div style={styles.container}>
        <div style={styles.card}>
          <h1 style={styles.title}>Admin Control Center</h1>

          <p style={styles.subText}>
            A centralized control system to manage learning resources, AI knowledge base,
            users, and platform performance. It ensures the system stays organized,
            scalable, and reliable for all students.
          </p>

          {/* CORE MODULES */}
          <div style={styles.grid}>
            <Section
              title="Resource Management"
              text="Upload, update, and organize study materials available to students."
            />
            <Section
              title="AI Knowledge Base"
              text="Control document ingestion into the RAG system for AI-powered Q&A."
            />
            <Section
              title="User Management"
              text="Monitor student accounts, activity logs, and engagement levels."
            />
            <Section
              title="Content Moderation"
              text="Ensure uploaded materials are relevant, clean, and properly structured."
            />
            <Section
              title="System Analytics"
              text="Track platform usage, queries, and performance metrics."
            />
            <Section
              title="Access Control"
              text="Manage permissions, roles, and administrative access levels."
            />
          </div>

          {/* HOW SYSTEM WORKS */}
          <div style={styles.infoBox}>
            <h2 style={styles.sectionTitleMain}>System Workflow</h2>
            <p style={styles.infoText}>
              1. Admin uploads or manages study resources  
              <br />
              2. Documents are processed and chunked for AI ingestion  
              <br />
              3. RAG system stores embeddings for semantic retrieval  
              <br />
              4. Students query AI using natural language  
              <br />
              5. System returns context-aware responses from stored knowledge
            </p>
          </div>

          {/* RESPONSIBILITIES */}
          <div style={styles.infoBox}>
            <h2 style={styles.sectionTitleMain}>Admin Responsibilities</h2>
            <p style={styles.infoText}>
              • Maintain quality of uploaded educational content  
              <br />
              • Ensure AI knowledge base is updated and accurate  
              <br />
              • Monitor system performance and resolve issues  
              <br />
              • Manage users and platform integrity  
              <br />
              • Keep learning experience structured and efficient
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const Section = ({ title, text }) => (
  <div style={styles.sectionCard}>
    <h3 style={styles.sectionTitle}>{title}</h3>
    <p style={styles.sectionText}>{text}</p>
  </div>
);

/* ---------------- STYLES ---------------- */
const styles = {
  page: {
    minHeight: "100vh",
    backgroundColor: "#f8fafc",
    backgroundImage:
      "radial-gradient(at 0% 0%, hsla(253,16%,7%,1) 0, transparent 50%), radial-gradient(at 50% 0%, hsla(225,39%,30%,1) 0, transparent 50%)",
    fontFamily: "'Inter', sans-serif",
  },

  container: {
    maxWidth: "1000px",
    margin: "0 auto",
    padding: "40px 20px",
  },

  card: {
    background: "rgba(255,255,255,0.95)",
    borderRadius: "1.25rem",
    padding: "30px",
    border: "1px solid rgba(255,255,255,0.3)",
    backdropFilter: "blur(10px)",
  },

  title: {
    fontSize: "26px",
    fontWeight: 800,
    color: "#1e293b",
    marginBottom: "10px",
  },

  subText: {
    fontSize: "14px",
    color: "#64748b",
    marginBottom: "25px",
    lineHeight: "1.7",
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
    gap: "15px",
    marginBottom: "20px",
  },

  sectionCard: {
    background: "#fff",
    border: "1px solid #e2e8f0",
    borderRadius: "1rem",
    padding: "18px",
  },

  sectionTitle: {
    fontSize: "16px",
    fontWeight: 700,
    color: "#4f46e5",
    marginBottom: "6px",
  },

  sectionText: {
    fontSize: "13px",
    color: "#64748b",
    lineHeight: "1.5",
  },

  infoBox: {
    marginTop: "20px",
    padding: "18px",
    borderRadius: "1rem",
    background: "#f8fafc",
    border: "1px solid #e2e8f0",
  },

  sectionTitleMain: {
    fontSize: "15px",
    fontWeight: 700,
    color: "#1e293b",
    marginBottom: "8px",
  },

  infoText: {
    fontSize: "13px",
    color: "#64748b",
    lineHeight: "1.7",
  },
};

export default AboutAdmin;