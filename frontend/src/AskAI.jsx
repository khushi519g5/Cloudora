import React, { useEffect, useState } from "react";

const AskAI = () => {
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const [docs, setDocs] = useState([]);
  const [documentId, setDocumentId] = useState("");
  const [ingesting, setIngesting] = useState(false);

  // ---------------- FETCH DOCS ----------------
  useEffect(() => {
    const fetchDocs = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/resources");
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
      const res = await fetch("http://localhost:5000/api/rag/ingest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resourceId: documentId }),
      });

      const data = await res.json();
      alert(`Ingestion done: ${data.chunks} chunks`);
    } catch (err) {
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
      const res = await fetch("http://localhost:5000/api/rag/ask", {
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
        {
          role: "ai",
          text: "Error fetching response",
          sources: [],
        },
      ]);
    }

    setQuestion("");
    setLoading(false);
  };

  // ---------------- UI ----------------
  return (
    <div style={styles.page}>
      <h2 style={styles.header}>🤖 AI Document Assistant</h2>

      {/* CONTROLS */}
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

      {/* CHAT BOX */}
      <div style={styles.chatBox}>
        {messages.map((msg, i) => (
          <div
            key={i}
            style={{
              ...styles.msg,
              alignSelf: msg.role === "user" ? "flex-end" : "flex-start",
              background: msg.role === "user" ? "#2563eb" : "#f3f4f6",
              color: msg.role === "user" ? "white" : "black",
            }}
          >
            {/* MESSAGE */}
            <div>{msg.text}</div>

            {/* SOURCES */}
            {msg.sources?.length > 0 && (
              <div style={styles.sources}>
                <b>Sources:</b>

                {msg.sources.map((s, idx) => (
                  <div key={idx} style={styles.sourceBox}>
                    <div style={{ fontSize: "12px", fontWeight: "bold" }}>
                      Chunk #{s.chunkIndex ?? idx}
                    </div>

                    <div style={{ fontSize: "12px", marginTop: "4px" }}>
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
        />

        <button onClick={handleAsk} style={styles.askBtn}>
          Ask
        </button>
      </div>
    </div>
  );
};

// ---------------- STYLES ----------------
const styles = {
  page: {
    maxWidth: "850px",
    margin: "30px auto",
    fontFamily: "Arial",
    display: "flex",
    flexDirection: "column",
    height: "90vh",
  },

  header: {
    fontSize: "22px",
    fontWeight: "bold",
    marginBottom: "15px",
  },

  controls: {
    display: "flex",
    gap: "10px",
    marginBottom: "10px",
  },

  select: {
    flex: 1,
    padding: "10px",
    borderRadius: "8px",
    border: "1px solid #ccc",
  },

  ingestBtn: {
    padding: "10px 15px",
    borderRadius: "8px",
    border: "none",
    background: "#f97316",
    color: "white",
    cursor: "pointer",
  },

  chatBox: {
    flex: 1,
    overflowY: "auto",
    padding: "15px",
    border: "1px solid #e5e7eb",
    borderRadius: "10px",
    background: "#fafafa",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },

  msg: {
    padding: "10px 12px",
    borderRadius: "12px",
    maxWidth: "70%",
    fontSize: "14px",
  },

  sources: {
    marginTop: "8px",
    fontSize: "11px",
    opacity: 0.8,
  },

  sourceBox: {
    marginTop: "6px",
    padding: "6px",
    background: "#e5e7eb",
    borderRadius: "6px",
  },

  loading: {
    fontSize: "13px",
    color: "#666",
  },

  inputBar: {
    display: "flex",
    marginTop: "10px",
    gap: "10px",
  },

  input: {
    flex: 1,
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid #ccc",
  },

  askBtn: {
    padding: "12px 18px",
    borderRadius: "8px",
    border: "none",
    background: "#2563eb",
    color: "white",
    cursor: "pointer",
  },
};

export default AskAI;