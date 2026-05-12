import { useEffect, useState, useRef } from "react";
import axios from "axios";
import socket from "./socket";
import Navbar from './Navbar';
import { 
  Search, BookOpen, Users, Send, X, 
  MessageCircle, ExternalLink, GraduationCap, Layout 
} from "lucide-react";

import bookIcon from "./assets/notes.png";
import HomeIcon from "./assets/house.png";

function Dashboard() {
  const [user, setUser] = useState(null);
  const [resources, setResources] = useState([]);
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [showChat, setShowChat] = useState(false);
  const [activeTab, setActiveTab] = useState(null);
  const [activeUserId, setActiveUserId] = useState(null);
  
  const scrollRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      try {
        const [resContent, resProfile, resUsers] = await Promise.all([
          axios.get("http://localhost:5000/api/resources"),
          axios.get("http://localhost:5000/api/auth/profile", {
            headers: { Authorization: `Bearer ${token}` }
          }),
          axios.get("http://localhost:5000/api/auth/users")
        ]);
        setResources(resContent.data);
        setUser(resProfile.data.user);
        setUsers(resUsers.data);
      } catch (error) {
        console.error("Initialization error:", error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const currentUserId = user?._id || user?.id;
    if (currentUserId) socket.emit("join_user", currentUserId);
  }, [user]);

  useEffect(() => {
    if (!selectedUser || !user) return;
    const currentUserId = user?._id || user?.id;
    axios.get(`http://localhost:5000/api/messages/${currentUserId}/${selectedUser._id}`)
      .then(res => setMessages(res.data))
      .catch(err => console.log(err));
  }, [selectedUser, user]);

  useEffect(() => {
    const handleMessage = (data) => {
      if (data.senderId === selectedUser?._id || data.receiverId === selectedUser?._id) {
        setMessages(prev => [...prev, data]);
      }
    };
    socket.on("receive_message", handleMessage);
    return () => socket.off("receive_message", handleMessage);
  }, [selectedUser]);

  const sendMessage = () => {
    const currentUserId = user?._id || user?.id;
    if (!currentUserId || !selectedUser || !input.trim()) return;
    const data = {
      senderId: currentUserId,
      receiverId: selectedUser._id,
      message: input.trim()
    };
    socket.emit("send_message", data);
    setInput("");
  };

  const filteredResources = resources.filter(res =>
    res.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={styles.page}>
      <Navbar />

      <div style={styles.container}>
        {/* HEADER AREA */}
        <div style={styles.topRow}>
          <div style={styles.pageHeader}>
             <img
                     src={HomeIcon}
                   alt="resource icon"
                     style={styles.resourceEmoji}
                        onError={(e) => {
                         e.target.style.display = "none";
                            }}
                  />
            <h2 style={{ margin: 7, fontWeight: 700, color: "#eeeff0" }}> Dashboard</h2>
          </div>
          
          <div style={styles.searchWrapper}>
  <Search size={18} style={styles.searchIcon} />

  <input
    placeholder="Search study materials..."
    value={search}
    onChange={(e) => setSearch(e.target.value)}

    onFocus={(e) => {
      e.target.style.border = "1px solid #4f46e5";
      e.target.style.boxShadow = "0 0 0 3px rgba(79,70,229,0.15)";
    }}

    onBlur={(e) => {
      e.target.style.border = "1px solid #e2e8f0";
      e.target.style.boxShadow = "none";
    }}

    style={styles.searchBar}
  />
</div>
        </div>

        {/* HERO CARD - White with Soft Border */}
       <div
  style={styles.heroCard}
  onMouseEnter={(e) => {
    e.currentTarget.style.transform = "translateY(-6px) scale(1.01)";
    e.currentTarget.style.boxShadow = "0 20px 40px -10px rgba(0,0,0,0.15)";
    e.currentTarget.style.border = "1px solid #4f46e5";
  }}
  onMouseLeave={(e) => {
    e.currentTarget.style.transform = "translateY(0) scale(1)";
    e.currentTarget.style.boxShadow = "0 10px 25px -5px rgba(0,0,0,0.05)";
     e.currentTarget.style.border = "1px solid rgba(255,255,255,0.3)"; // reset
  }}
>
  <div style={styles.heroText}>
    <div style={styles.badge}>
      <GraduationCap size={14} style={{ marginRight: '6px' }} />
      Welcome Back
    </div>

    <h1 style={styles.title}>
      Hello, <span style={styles.name}>{user?.name || "Student"}</span>!
    </h1>

    <p style={styles.description}>
      Track your progress, download latest materials, and chat with your peers.
    </p>
  </div>

  <div style={styles.heroIllustration} />
</div>

        {/* STATS SECTION */}
        <div style={styles.statsGrid}>

  {/* -------- Resources Card -------- */}
  <div
    style={styles.statCard}
    onMouseEnter={(e) => {
      e.currentTarget.style.backgroundColor = "#eef2ff";
      e.currentTarget.style.border = "1px solid #c7d2fe";
      e.currentTarget.style.transform = "translateY(-4px)";

      const texts = e.currentTarget.querySelectorAll("p, h3");
      texts.forEach(el => el.style.color = "#4f46e5");

      const icon = e.currentTarget.querySelector(".iconBox");
      if (icon) {
        icon.style.backgroundColor = "#4f46e5";
        icon.style.color = "#fff";
      }
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.backgroundColor = "#fff";
      e.currentTarget.style.border = "1px solid #e2e8f0";
      e.currentTarget.style.transform = "translateY(0)";

      const texts = e.currentTarget.querySelectorAll("p, h3");
      texts.forEach(el => el.style.color = "");

      const icon = e.currentTarget.querySelector(".iconBox");
      if (icon) {
        icon.style.backgroundColor = "#eef2ff";
        icon.style.color = "#4f46e5";
      }
    }}
  >
    <div
      className="iconBox"
      style={{ ...styles.iconBox, backgroundColor: "#eef2ff", color: "#4f46e5" }}
    >
      <BookOpen size={24} />
    </div>

    <div>
      <p style={styles.statLabel}>Resources</p>
      <h3 style={styles.statValue}>{resources.length}</h3>
    </div>
  </div>

  {/* -------- Peers Card -------- */}
  <div
    style={styles.statCard}
    onMouseEnter={(e) => {
    e.currentTarget.style.backgroundColor = "#eef2ff";
      e.currentTarget.style.border = "1px solid #c7d2fe";
      e.currentTarget.style.transform = "translateY(-4px)";
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.backgroundColor = "#fff";
      e.currentTarget.style.border = "1px solid #e4f0e2";
      e.currentTarget.style.transform = "translateY(0)";
    }}
  >
    <div
      style={{ ...styles.iconBox, backgroundColor: "#eef2ff", color: "#4f46e5" }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = "#16a34a";
        e.currentTarget.style.color = "#fff";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = "#f0fdf4";
        e.currentTarget.style.color = "#16a34a";
      }}
    >
      <Users size={24} />
    </div>

    <div>
      <p style={styles.statLabel}>Peers Online</p>
      <h3 style={styles.statValue}>
        {users.length > 0 ? users.length - 1 : 0}
      </h3>
    </div>
  </div>

</div>

        {/* CONTENT GRID */}
        <h3 style={styles.sectionHeader}>Study Materials</h3>
       <div style={styles.resourceGrid}>
  {filteredResources.map((item, index) => (
    <div
      key={index}
      style={styles.resourceCard}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-4px)";
        e.currentTarget.style.boxShadow = "0 10px 20px rgba(0,0,0,0.08)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "none";
      }}
    >
      <div style={styles.cardHeader}>
        <img
          src={bookIcon}
          alt="resource icon"
          style={styles.resourceEmoji}
          onError={(e) => {
            e.target.style.display = "none";
          }}
        />
        <span style={styles.authorBadge}>
          {item.uploadedBy || "Faculty"}
        </span>
      </div>

      <h4 style={styles.cardTitle}>{item.title}</h4>
      <p style={styles.cardDesc}>{item.description}</p>

      <a
        href={item.fileUrl}
        target="_blank"
        rel="noreferrer"
        style={styles.primaryBtn}
      >
        <ExternalLink size={16} style={{ marginRight: "8px" }} />
        Open File
      </a>
    </div>
  ))}
</div>
</div>


      {/* CHAT FAB */}
      <button style={styles.chatFab} onClick={() => setShowChat(!showChat)}>
        {showChat ? <X size={28} /> : <MessageCircle size={28} />}
      </button>

      {/* CHAT WIDGET - Matches Login Card Style */}
      {showChat && (
        <div style={styles.chatWindow}>
          <div style={styles.chatHeader}>
            <h5 style={{ margin: 0, fontWeight: 700 }}>Peer Messenger</h5>
            <button style={styles.closeBtn} onClick={() => setShowChat(false)}><X size={18}/></button>
          </div>

          <div style={styles.userList}>
            {users.filter(u => u._id !== (user?._id || user?.id)).map(u => (
            <div
  key={u._id}
  style={{
    ...styles.avatar,
    width: "auto",
    padding: "0 10px",
    border: selectedUser?._id === u._id
      ? "2px solid #4f46e5"
      : "2px solid transparent",
    transform: selectedUser?._id === u._id
      ? "scale(1.05)"
      : "scale(1)"
  }}
  onClick={() => setSelectedUser(u)}
  title={u.name}
>
  <span
  style={{
    fontSize: "12px",
    fontWeight: 600,
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    maxWidth: "120px",
    display: "inline-block"
  }}
>
  {u.name}
</span>
</div>
            ))}
          </div>

          <div style={styles.chatBody}>
            {selectedUser ? (
              <>
                <div style={styles.msgContainer}>
                  {messages.map((msg, i) => {
                    const isMe = msg.senderId?.toString() === (user?._id || user?.id);
                    return (
                      <div key={i} style={{
                        ...styles.bubble,
                        alignSelf: isMe ? 'flex-end' : 'flex-start',
                        backgroundColor: isMe ? '#4f46e5' : '#f1f5f9',
                        color: isMe ? '#fff' : '#1e293b',
                        borderRadius: isMe ? '12px 12px 2px 12px' : '12px 12px 12px 2px'
                      }}>
                        {msg.message}
                      </div>
                    );
                  })}
                  <div ref={scrollRef} />
                </div>
                <div style={styles.chatInputRow}>
                  <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                    style={styles.inputField}
                    placeholder="Type here..."
                  />
                  <button style={styles.sendButton} onClick={sendMessage}><Send size={16} /></button>
                </div>
              </>
            ) : (
              <div style={styles.emptyState}>Select a user to chat</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── ALIGNED STYLES ─────────────────────────────────────
const styles = {
  page: {
    minHeight: "100vh",
    backgroundColor: "#f8fafc", // Light slate gray background
    backgroundImage: `radial-gradient(at 0% 0%, hsla(253,16%,7%,1) 0, transparent 50%), 
                      radial-gradient(at 50% 0%, hsla(225,39%,30%,1) 0, transparent 50%)`,
    backgroundAttachment: "fixed",
    fontFamily: "'Inter', sans-serif",
    paddingBottom: "80px"
  },
  container: { maxWidth: "1100px", margin: "0 auto", padding: "0 20px" },
  topRow: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "30px 0" },
 pageHeader: { display: "flex", alignItems: "center", color: "#fff" },
  searchWrapper: { position: "relative", width: "300px" },
  searchIcon: { position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#94a3b8" },
 searchBar: {
  width: "100%",
  padding: "10px 15px 10px 40px",
  borderRadius: "0.75rem",
  border: "1px solid #e2e8f0",
  backgroundColor: "rgba(255, 255, 255, 0.9)",
  outline: "none",
  fontSize: "0.9rem",
  transition: "all 0.25s ease"
},
 heroCard: {
  padding: "40px",
  borderRadius: "1.25rem",
  backgroundColor: "rgba(255, 255, 255, 0.95)",
  backdropFilter: "blur(10px)",
  border: "1px solid rgba(255,255,255,0.3)", // default border
  marginBottom: "30px",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.05)",
  transition: "all 0.3s ease",  // 👈 enables smooth border + shadow + move
  cursor: "pointer"
},
  badge: {
    display: "inline-flex",
    alignItems: "center",
    backgroundColor: "#f1f5f9",
    color: "#4f46e5",
    padding: "5px 12px",
    borderRadius: "99px",
    fontSize: "12px",
    fontWeight: "600",
    marginBottom: "15px"
  },
  
  title: { fontSize: "32px", fontWeight: "800", color: "#1e293b", margin: 0 },
  name: { color: "#4f46e5" },
  description: { color: "#64748b", marginTop: "10px", fontSize: "16px" },
  
  statsGrid: { display: "flex", gap: "20px", marginBottom: "40px" },
  statCard: { 
  flex: 1,
  backgroundColor: "#fff",
  padding: "20px",
  borderRadius: "1rem", 
  display: "flex",
  alignItems: "center",
  gap: "15px",
  border: "1px solid #e2e8f0",
  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.02)",
  transition: "all 0.25s ease",
  cursor: "pointer"
},
heroIllustration: {
  width: "120px",
  height: "120px",
  borderRadius: "50%",
  background: "linear-gradient(135deg, #4f46e5, #6366f1)",
  opacity: 0.1
},
  iconBox: { width: "48px", height: "48px", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center" },
statLabel: {
  margin: 0,
  fontSize: "13px",
  fontWeight: "500",
  transition: "all 0.2s ease"
},

statValue: {
  margin: 0,
  fontSize: "24px",
  fontWeight: "700",
  transition: "all 0.2s ease"
},
  sectionHeader: { fontSize: "18px", fontWeight: "700", color: "#1e293b", marginBottom: "20px" },
  resourceGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "20px" },
  resourceCard: {
  backgroundColor: "#fff",
  padding: "25px",
  borderRadius: "1rem",
  border: "1px solid #4f46e5",
  display: "flex",
  flexDirection: "column",
  transition: "all 0.2s ease",
  cursor: "pointer"
},
  resourceEmoji: {
  width: "24px",
  height: "24px",
  objectFit: "contain"
},


  cardHeader: { display: "flex", justifyContent: "space-between", marginBottom: "15px" },
  
  authorBadge: { fontSize: "10px", fontWeight: "700", color: "#4f46e5", backgroundColor: "#eef2ff", padding: "4px 8px", borderRadius: "6px", textTransform: "uppercase" },
  cardTitle: { fontSize: "17px", fontWeight: "700", color: "#1e293b", marginBottom: "8px" },
  cardDesc: { color: "#64748b", fontSize: "14px", marginBottom: "20px", flex: 1 },
  primaryBtn: {
    padding: "10px", textAlign: "center", backgroundColor: "#4f46e5", color: "#fff", 
    borderRadius: "0.5rem", textDecoration: "none", fontWeight: "600", fontSize: "14px",
    display: "flex", alignItems: "center", justifyContent: "center"
  },

  chatFab: {
    position: "fixed", bottom: "30px", right: "30px", width: "60px", height: "60px",
    borderRadius: "50%", backgroundColor: "#4f46e5", color: "#fff", border: "none", cursor: "pointer",
    boxShadow: "0 10px 15px -3px rgba(79, 70, 229, 0.4)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center"
  },
  chatWindow: {
    position: "fixed", bottom: "100px", right: "30px", width: "350px", height: "500px",
    backgroundColor: "#fff", borderRadius: "1.25rem", border: "1px solid #e2e8f0",
    boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)", zIndex: 1000, display: "flex", flexDirection: "column", overflow: "hidden"
  },
  chatHeader: { padding: "15px 20px", borderBottom: "1px solid #f1f5f9", display: "flex", justifyContent: "space-between", alignItems: "center", backgroundColor: "#f8fafc" },
  closeBtn: { background: "none", border: "none", cursor: "pointer", color: "#64748b" },
  userList: { padding: "10px 15px", display: "flex", gap: "10px", overflowX: "auto", borderBottom: "1px solid #f1f5f9" },
  avatar: { 
    width: "40px", height: "40px", borderRadius: "50%", backgroundColor: "#f1f5f9", color: "#4f46e5",
    display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "700", cursor: "pointer", flexShrink: 0, transition: "0.2s"
  },
  chatBody: { flex: 1, display: "flex", flexDirection: "column", padding: "15px" },
  msgContainer: { flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: "10px", paddingBottom: "10px" },
  bubble: { padding: "8px 14px", fontSize: "14px", maxWidth: "80%" },
  chatInputRow: { display: "flex", gap: "8px", paddingTop: "10px" },
  inputField: { flex: 1, padding: "8px 12px", borderRadius: "0.5rem", border: "1px solid #e2e8f0", outline: "none", fontSize: "14px" },
  sendButton: { backgroundColor: "#4f46e5", color: "#fff", border: "none", borderRadius: "0.5rem", width: "40px", height: "40px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" },
  emptyState: { flex: 1, display: "flex", alignItems: "center", justifyContent: "center", color: "#94a3b8", fontSize: "14px" }
};

export default Dashboard;