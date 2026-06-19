import React, { useEffect, useState } from "react";
import Navbar from "./navbar";
const API_URL = import.meta.env.VITE_API_URL;
const RAG_URL = import.meta.env.VITE_RAG_URL;

const AskAI = () => {
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const [docs, setDocs] = useState([]);
  const [documentId, setDocumentId] = useState("");
  const [ingesting, setIngesting] = useState(false);


  // ---------------- MOBILE CHECK ----------------
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // ---------------- FETCH DOCS ----------------
  useEffect(() => {
    const fetchDocs = async () => {
      try {
       const res = await fetch(`${API_URL}/api/resources`);
        const data = await res.json();
        setDocs(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchDocs();
  }, []);

  // ---------------- INGEST ----------------
  const handleIngest = async () => {
    if (!documentId) return alert("Select a document first");
    setIngesting(true);

    try {
    const res = await fetch(`${RAG_URL}/api/rag/ingest`,{
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resourceId: documentId }),
      });

      const data = await res.json();
      alert(`Ingestion done: ${data.chunks} chunks`);
    } catch {
      alert("Ingestion failed");
    }

    setIngesting(false);
  };

  // ---------------- ASK ----------------
  const handleAsk = async () => {
    if (!question.trim()) return;
    if (!documentId) return alert("Select a document first");

    const updated = [...messages, { role: "user", text: question }];
    setMessages(updated);
    setLoading(true);

    try {
     const res = await fetch(`${RAG_URL}/api/rag/ask`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question, documentId }),
      });

      const data = await res.json();

      setMessages([
        ...updated,
        {
          role: "ai",
          text: data.answer,
          sources: data.sources || [],
        },
      ]);
    } catch {
      setMessages([
        ...updated,
        { role: "ai", text: "Error fetching response", sources: [] },
      ]);
    }

    setQuestion("");
    setLoading(false);
  };

  // ---------------- STYLES ----------------
  const styles = {
    page: {
      minHeight: "100vh",
      backgroundColor: "#f8fafc",
      backgroundImage:
        "radial-gradient(at 0% 0%, hsla(253,16%,7%,1) 0, transparent 50%), radial-gradient(at 50% 0%, hsla(225,39%,30%,1) 0, transparent 50%)",
      paddingBottom: "40px",
      fontFamily: "'Inter', sans-serif",
    },

    container: {
      maxWidth: "900px",
      margin: "0 auto",
      padding: isMobile ? "12px" : "20px",
    },

    headerCard: {
      backgroundColor: "rgba(255,255,255,0.95)",
      padding: "20px",
      borderRadius: "1.25rem",
      marginTop: "20px",
      marginBottom: "20px",
      border: "1px solid rgba(255,255,255,0.3)",
      backdropFilter: "blur(10px)",
    },

    title: {
      fontSize: "20px",
      fontWeight: "800",
      color: "#1e293b",
      marginBottom: "12px",
    },

    controls: {
      display: "flex",
      gap: "10px",
      flexDirection: isMobile ? "column" : "row",
    },

    select: {
      flex: 1,
      padding: "10px",
      borderRadius: "0.75rem",
      border: "1px solid #e2e8f0",
      outline: "none",
      width: isMobile ? "100%" : "auto",
    },

    ingestBtn: {
      padding: "10px 14px",
      borderRadius: "0.75rem",
      border: "none",
      background: "#f97316",
      color: "#fff",
      fontWeight: 600,
      cursor: "pointer",
      width: isMobile ? "100%" : "auto",
    },

    chatCard: {
      backgroundColor: "rgba(255,255,255,0.95)",
      borderRadius: "1.25rem",
      border: "1px solid rgba(255,255,255,0.3)",
      backdropFilter: "blur(10px)",
      display: "flex",
      flexDirection: "column",
      height: isMobile ? "75vh" : "70vh",
      overflow: "hidden",
    },

    chatBox: {
      flex: 1,
      padding: "15px",
      overflowY: "auto",
      display: "flex",
      flexDirection: "column",
      gap: "10px",
    },

    msg: {
      padding: "10px 12px",
      borderRadius: "12px",
      maxWidth: isMobile ? "85%" : "70%",
      fontSize: "14px",
    },

    sources: {
      marginTop: "8px",
      fontSize: "11px",
      opacity: 0.9,
    },

    sourceBox: {
      marginTop: "5px",
      padding: "6px",
      background: "#e2e8f0",
      borderRadius: "6px",
    },

    loading: {
      fontSize: "13px",
      color: "#64748b",
    },

    inputBar: {
      display: "flex",
      gap: "10px",
      padding: "12px",
      borderTop: "1px solid #e2e8f0",
      background: "#f8fafc",
      flexDirection: isMobile ? "column" : "row",
    },

    input: {
      flex: 1,
      padding: "12px",
      borderRadius: "0.75rem",
      border: "1px solid #e2e8f0",
      outline: "none",
      width: isMobile ? "100%" : "auto",
    },

    askBtn: {
      padding: "12px 16px",
      borderRadius: "0.75rem",
      border: "none",
      background: "#4f46e5",
      color: "#fff",
      fontWeight: 600,
      cursor: "pointer",
      width: isMobile ? "100%" : "auto",
    },
  };

  return (
    <div style={styles.page}>
      <Navbar />

      <div style={styles.container}>
        {/* HEADER */}
        <div style={styles.headerCard}>
          <h2 style={styles.title}>🤖 AI Assistant</h2>

          <div style={styles.controls}>
            <select
              value={documentId}
              onChange={(e) => setDocumentId(e.target.value)}
              style={styles.select}
            >
              <option value="">Select Document</option>
              {docs.map((doc) => (
                <option key={doc._id} value={doc._id}>
                  {doc.title}
                </option>
              ))}
            </select>

            <button onClick={handleIngest} style={styles.ingestBtn}>
              {ingesting ? "Processing..." : "Ingest"}
            </button>
          </div>
        </div>

        {/* CHAT */}
        <div style={styles.chatCard}>
          <div style={styles.chatBox}>
            {messages.map((msg, i) => (
              <div
                key={i}
                style={{
                  ...styles.msg,
                  alignSelf:
                    msg.role === "user" ? "flex-end" : "flex-start",
                  background:
                    msg.role === "user" ? "#4f46e5" : "#f1f5f9",
                  color: msg.role === "user" ? "#fff" : "#1e293b",
                }}
              >
                <div>{msg.text}</div>

                {msg.sources?.length > 0 && (
                  <div style={styles.sources}>
                    <b>Sources:</b>
                    {msg.sources.map((s, idx) => (
                      <div key={idx} style={styles.sourceBox}>
                        <div style={{ fontSize: "11px", fontWeight: 600 }}>
                          Chunk #{s.chunkIndex ?? idx}
                        </div>
                        <div style={{ fontSize: "11px" }}>
                          {s.text}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {loading && <div style={styles.loading}>Thinking...</div>}
          </div>

          {/* INPUT */}
          <div style={styles.inputBar}>
            <input
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Ask about your document..."
              style={styles.input}
              onKeyDown={(e) => e.key === "Enter" && handleAsk()}
            />

            <button onClick={handleAsk} style={styles.askBtn}>
              Ask
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AskAI;