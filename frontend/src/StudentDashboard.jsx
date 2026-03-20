import { useEffect, useState } from "react";
import axios from "axios";
import socket from "./socket";

function Dashboard() {
  const [user, setUser] = useState(null);
  const [resources, setResources] = useState([]);
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState([]);

  // 🔥 CHAT STATES
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [showChat, setShowChat] = useState(false);

  // 🔹 Fetch resources
  useEffect(() => {
    const fetchResources = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/resources");
        setResources(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchResources();
  }, []);

  // 🔹 Fetch user profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/auth/profile", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUser(res.data.user);
      } catch (error) {
        console.log(error);
      }
    };
    fetchProfile();
  }, []);

  // 🔹 Fetch all users
  useEffect(() => {
    axios.get("http://localhost:5000/api/auth/users")
      .then(res => setUsers(res.data))
      .catch(err => console.log(err));
  }, []);

  // 🔥 JOIN SOCKET
  useEffect(() => {
    const currentUserId = user?._id || user?.id;

    if (currentUserId) {
      socket.emit("join_user", currentUserId);
    }
  }, [user]);

  // 🔥 FETCH OLD MESSAGES
  useEffect(() => {
    if (!selectedUser || !user) return;

    const currentUserId = user?._id || user?.id;
    if (!currentUserId) return;

    axios
      .get(`http://localhost:5000/api/messages/${currentUserId}/${selectedUser._id}`)
      .then(res => {
        setMessages(res.data);
      })
      .catch(err => console.log(err));

  }, [selectedUser, user]);

  // 🔥 RECEIVE MESSAGE (REALTIME)
  useEffect(() => {
    const handleMessage = (data) => {
      const currentUserId = user?._id || user?.id;

      if (!currentUserId || !selectedUser) return;

      // Only update current chat
      if (
        data.senderId === selectedUser._id ||
        data.receiverId === selectedUser._id
      ) {
        setMessages(prev => [...prev, data]);
      }
    };

    socket.on("receive_message", handleMessage);
    return () => socket.off("receive_message", handleMessage);
  }, [user, selectedUser]);

  // 🔥 SEND MESSAGE (FIXED)
  const sendMessage = async () => {
    const currentUserId = user?._id || user?.id;

    if (!currentUserId) {
      alert("User not loaded yet");
      return;
    }

    if (!selectedUser?._id) {
      alert("Select user first");
      return;
    }

    if (!input.trim()) {
      alert("Empty message");
      return;
    }

    const data = {
      senderId: currentUserId,
      receiverId: selectedUser._id,
      message: input.trim()
    };

    try {
      // ✅ ONLY SOCKET (NO AXIOS HERE)
      socket.emit("send_message", data);
      setInput("");
    } catch (err) {
      console.log(err);
    }
  };

  // 🔹 Filter resources
  const filteredResources = resources.filter(res =>
    res.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={styles.page}>
      {/* NAVBAR */}
      <div style={styles.navbar}>
        <div style={styles.logo}>✨ ResourceHub</div>
        <div style={styles.navRight}>
          <input
            placeholder="Search resources..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={styles.search}
          />
          <button
            style={styles.logoutBtn}
            onClick={() => {
              localStorage.removeItem("token");
              window.location.href = "/login";
            }}
          >
            Logout
          </button>
        </div>
      </div>

      {/* HERO */}
      <div style={styles.hero}>
        <p style={styles.subtitle}>Welcome back {user?.name || ""} 👋</p>
        <h1 style={styles.title}>Your Knowledge Base</h1>
        <p style={styles.description}>
          Organize, access, and share your study resources.
        </p>
      </div>

      {/* STATS */}
      <div style={styles.statsRow}>
        {[
          { title: "Total Resources", value: resources.length, icon: "📚" },
          { title: "Search Results", value: filteredResources.length, icon: "🔍" }
        ].map((item, index) => (
          <div key={index} style={styles.statCard}>
            <div style={styles.statTop}>
              <div style={styles.statIcon}>{item.icon}</div>
              <div>
                <p style={styles.statTitle}>{item.title}</p>
                <h2>{item.value}</h2>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* RESOURCES */}
      <div style={styles.grid}>
        {filteredResources.map((item, index) => (
          <div
            key={index}
            style={{ ...styles.resourceCard, background: "linear-gradient(135deg, #1e3a8a, #1e293b)" }}
          >
            <div style={styles.iconBadge}>📘</div>
            <h3 style={styles.cardTitle}>{item.title}</h3>
            <p style={styles.cardDesc}>{item.description}</p>
            <p style={{ color: "#60a5fa" }}>Uploaded by: {item.uploadedBy || "Admin"}</p>
          </div>
        ))}
      </div>

      {/* CHAT BUTTON */}
      <button
        style={styles.chatButton}
        onClick={() => setShowChat(!showChat)}
      >
        💬
      </button>

      {/* CHAT POPUP */}
      {showChat && (
        <div style={styles.chatPopup}>
          <div style={styles.chatHeader}>
            <span>Chat</span>
            <button onClick={() => setShowChat(false)}>✖</button>
          </div>

          {/* USERS */}
          <div style={styles.userList}>
            {users.filter(u => u._id !== (user?._id || user?.id)).map(u => (
              <div
                key={u._id}
                style={{
                  ...styles.userItem,
                  background: selectedUser?._id === u._id ? "#1e40af" : "transparent"
                }}
                onClick={() => setSelectedUser(u)}
              >
                👤 {u.name}
              </div>
            ))}
          </div>

          <p style={styles.selectedUserText}>
            Chatting with: {selectedUser?.name || "Select a user"}
          </p>

          {/* MESSAGES */}
          <div style={styles.chatMessages}>
            {messages.map((msg, i) => (
              <div
                key={i}
                style={{
                  ...styles.message,
                  alignSelf:
                    msg.senderId?.toString() === (user?._id || user?.id)
                      ? "flex-end"
                      : "flex-start",
                  background:
                    msg.senderId?.toString() === (user?._id || user?.id)
                      ? "#2563eb"
                      : "#1e293b"
                }}
              >
                {msg.message}
              </div>
            ))}
          </div>

          {/* INPUT */}
          <div style={styles.chatInputBox}>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              style={styles.chatInput}
              placeholder="Type message..."
            />
            <button style={styles.sendBtn} onClick={sendMessage}>
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
// ─── STYLES ─────────────────────────────────────────────
const styles = {
  page: {
    minHeight: "100vh",
    padding: "60px 80px",
    fontFamily: "Poppins, sans-serif",
    color: "#ffffff",
    background: `
      radial-gradient(circle at 20% 20%, #1e40af40 0%, transparent 40%),
      radial-gradient(circle at 80% 80%, #2563eb30 0%, transparent 40%),
      #0b1220
    `
  },
  chatButton: {
    position: "fixed",
    bottom: "30px",
    right: "30px",
    width: "60px",
    height: "60px",
    borderRadius: "50%",
    background: "#1e40af",
    color: "white",
    fontSize: "24px",
    border: "none",
    cursor: "pointer",
  },
  
  chatHeader: { 
    display: "flex", justifyContent: "space-between", marginBottom: "10px" 
  },

 chatPopup: {
  position: "fixed",
  bottom: "100px",
  right: "30px",
  width: "320px",
  height: "420px",
  background: "#0f172a",
  borderRadius: "20px",
  padding: "10px",
  display: "flex",
  flexDirection: "column",
  border: "1px solid rgba(255,255,255,0.1)",
  boxSizing: "border-box"
},

chatMessages: {
  flex: 1,
  overflowY: "auto",
  background: "#020617",
  padding: "10px",
  borderRadius: "10px",
  marginBottom: "10px",
  display: "flex",
  flexDirection: "column",
  gap: "6px"
},

message: {
  padding: "6px 10px",
  borderRadius: "8px",
  color: "#ffffff",
  maxWidth: "80%",
  wordBreak: "break-word"
},

chatInputBox: {
  display: "flex",
  gap: "5px",
  marginTop: "5px"
},

chatInput: {
  flex: 1,
  padding: "8px",
  borderRadius: "8px",
  border: "none",
  background: "#1e293b",
  color: "#ffffff"
},

sendBtn: {
  padding: "8px",
  borderRadius: "8px",
  background: "#2563eb",
  color: "#ffffff",
  border: "none",
  cursor: "pointer"
},
userList: { maxHeight: "120px", overflowY: "auto", marginBottom: "10px" },
  userItem: { padding: "8px", background: "#1e3a8a", marginBottom: "5px", borderRadius: "8px", cursor: "pointer" },
  
  

   navbar: { display: "flex", justifyContent: "space-between", marginBottom: "60px" },
  logo: { fontSize: "22px", fontWeight: "600" },
  navRight: { display: "flex", gap: "20px" },
  search: { padding: "10px 18px", borderRadius: "20px", border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.05)", color: "white" },
  logoutBtn: { padding: "8px 18px", borderRadius: "20px", border: "1px solid rgba(255,255,255,0.2)", background: "transparent", color: "white", cursor: "pointer" },
  hero: { padding: "40px", borderRadius: "20px", background: "rgba(30, 58, 138, 0.25)", marginBottom: "40px" },
  subtitle: { color: "#60a5fa" },
  title: { fontSize: "40px" },
  description: { color: "#94a3b8" },
  statsRow: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "20px", marginBottom: "40px" },
  statCard: { background: "rgba(30, 58, 138, 0.2)", padding: "20px", borderRadius: "20px" },
  statTop: { display: "flex", gap: "15px" },
  statIcon: { fontSize: "25px" },
  statTitle: { color: "#94a3b8" },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "20px" },
  resourceCard: { padding: "25px", borderRadius: "20px" },
  iconBadge: { fontSize: "30px", marginBottom: "10px" },
  cardTitle: { fontSize: "20px" },
  cardDesc: { color: "#cbd5e1" },
  selectedUserText: { color: "#60a5fa", marginBottom: "8px" }
};

export default Dashboard;