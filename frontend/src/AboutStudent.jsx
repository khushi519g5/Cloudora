import React from "react";
import Navbar from "./navbar";

const AboutStudent = () => {
  return (
    <div style={styles.page}>
      <Navbar />

      <div style={styles.container}>
        <div style={styles.card}>
          <h1 style={styles.title}>About the Learning Platform</h1>

          <p style={styles.subText}>
            This platform is built to improve student learning using structured study materials,
            AI-powered assistance, and real-time collaboration tools. It reduces dependency on
            scattered resources and brings everything into one intelligent system.
          </p>

          {/* CORE FEATURES */}
          <div style={styles.grid}>
            <Section
              title="Smart Study Materials"
              text="Organized lecture notes, PDFs, and resources uploaded by faculty in one place."
            />
            <Section
              title="AI Learning Assistant"
              text="Ask questions from your uploaded documents and get instant, context-aware answers."
            />
            <Section
              title="Peer Collaboration"
              text="Interact with classmates, discuss doubts, and learn collaboratively in real time."
            />
            <Section
              title="Intelligent Search"
              text="Find relevant study materials quickly using semantic search across all resources."
            />
            <Section
              title="Progress Tracking"
              text="Monitor your engagement with materials and improve study consistency."
            />
            <Section
              title="Centralized Learning"
              text="No need to switch platforms — everything is integrated into a single system."
            />
          </div>

          {/* HOW IT WORKS */}
          <div style={styles.infoBox}>
            <h2 style={styles.sectionTitleMain}>How It Works</h2>
            <p style={styles.infoText}>
              1. Faculty upload study materials (PDFs, notes, documents)  
              <br />
              2. Documents are processed into AI-readable chunks  
              <br />
              3. AI retrieves relevant context using RAG (Retrieval Augmented Generation)  
              <br />
              4. Students ask questions and receive accurate answers instantly
            </p>
          </div>

          {/* BENEFITS */}
          <div style={styles.infoBox}>
            <h2 style={styles.sectionTitleMain}>Why Students Use It</h2>
            <p style={styles.infoText}>
              • Saves time searching for notes  
              <br />
              • Improves understanding through AI explanations  
              <br />
              • Encourages collaborative learning  
              <br />
              • Reduces dependency on external sources  
              <br />
              • Makes revision faster and more structured
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
    marginBottom: "25px",
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

  /* EXTRA INFO BLOCKS */
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

export default AboutStudent;