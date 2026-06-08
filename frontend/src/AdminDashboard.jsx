import { useState, useEffect, useRef } from "react";
import UploadResource from "./UploadResource";
import axios from "axios";
import admin from "./assets/admin.png";
import socket from "./socket"; // ADD THIS
import { 
  Search, BookOpen, Users, Send, X, 
  MessageCircle, ExternalLink, GraduationCap, Layout 
} from "lucide-react";
import Navbar from './admin_navbar';
const API_URL = import.meta.env.VITE_API_URL;



export default function AdminDashboard() {
  const [resources, setResources] = useState([]);
  const [selectedResources, setSelectedResources] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  //  CHAT STATES
const [messages, setMessages] = useState([]);
const [input, setInput] = useState("");
const [selectedUser, setSelectedUser] = useState(null);
const [showChat, setShowChat] = useState(false);
const [users, setUsers] = useState([]);
const [user, setUser] = useState(null);

 const scrollRef = useRef(null);

  // FETCH RESOURCES
  const refreshResources = async () => {
    try {
     const res = await axios.get(`${API_URL}/api/resources`);
      setResources(res.data);
    } catch (error) {
      console.error(error);
    }
  };
// 🔹 Fetch logged-in user
useEffect(() => {
  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("token");
     const res = await axios.get(
  `${API_URL}/api/auth/profile`,
   {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUser(res.data.user);
    } catch (err) {
      console.log(err);
    }
  };
  fetchProfile();
}, []);

// 🔹 Fetch all users
useEffect(() => {
  axios.get(`${API_URL}/api/auth/users`)
    .then(res => setUsers(res.data))
    .catch(err => console.log(err));
}, []);


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
     await axios.delete(`${API_URL}/api/resources/${id}`);
      setResources(resources.filter((r) => r._id !== id));
      setSelectedResources((prev) => prev.filter((r) => r !== id));
    } catch (error) {
      console.error(error);
    }
  };
  // 🔥 JOIN SOCKET
useEffect(() => {
  const currentUserId = user?._id || user?.id;
  if (currentUserId) {
    socket.emit("join_user", currentUserId);
  }
}, [user]);
useEffect(() => {
  if (!selectedUser || !user) return;

  const currentUserId = user?._id || user?.id;

  axios
   .get(`${API_URL}/api/messages/${currentUserId}/${selectedUser._id}`)
    .then(res => setMessages(res.data))
    .catch(err => console.log(err));

}, [selectedUser, user]);
useEffect(() => {
  const handleMessage = (data) => {
    const currentUserId = user?._id || user?.id;

    if (!currentUserId || !selectedUser) return;

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
const sendMessage = () => {
  const currentUserId = user?._id || user?.id;

  if (!currentUserId || !selectedUser?._id || !input.trim()) return;

  socket.emit("send_message", {
    senderId: currentUserId,
    receiverId: selectedUser._id,
    message: input.trim()
  });

  setInput("");
};

  // DELETE BULK RESOURCES
  const handleBulkDelete = async () => {
    const confirmDelete = window.confirm(`Do you really want to delete ${selectedResources.length} resources?`);
    if (!confirmDelete) return;

    try {
      await Promise.all(selectedResources.map((id) => axios.delete(`${API_URL}/api/resources/${id}`)));
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
      <Navbar /> {/* Ensure Navbar is consistent */}

      <div style={styles.container}>
        {/* HEADER AREA */}
        <div style={styles.topRow}>
          <div style={styles.pageHeader}>
            <img src={admin} alt="admin" style={{ width: "40px", marginRight: "12px" }} />
            <h2 style={{ margin: 0, fontWeight: 700, color: "#eeeff0" }}>Admin Panel</h2>
          </div>
          
          <input
  placeholder="Search resources..."
  style={styles.searchBar}
  value={searchQuery}
  onChange={(e) => setSearchQuery(e.target.value)}

  onFocus={(e) => {
    e.target.style.border = "1px solid #4f46e5";
    e.target.style.boxShadow = "0 0 0 3px rgba(79,70,229,0.15)";
  }}

  onBlur={(e) => {
    e.target.style.border = "1px solid #e2e8f0";
    e.target.style.boxShadow = "none";
  }}
/>
        </div>

        {/* HERO CARD - Aligned with Student Dashboard */}
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
            e.currentTarget.style.border = "1px solid rgba(255,255,255,0.3)";
          }}
        >
          <div style={styles.heroText}>
            <div style={styles.badge}>
              <Layout size={14} style={{ marginRight: '6px' }} />
              Management Console
            </div>
            <h1 style={styles.title}>Platform Resources</h1>
            <p style={styles.description}>
              Control the flow of learning materials, manage peer interactions, and track system growth.
            </p>
          </div>
          <div style={styles.heroIllustration} />
        </div>

        {/* STATS SECTION */}
       <div style={styles.statsGrid}>
  <div
    style={styles.statCard}
    onMouseEnter={(e) => {
      e.currentTarget.style.backgroundColor = "#eff6ff";
      e.currentTarget.style.border = "1px solid #3b82f6";
      e.currentTarget.style.transition = "0.3s";
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.backgroundColor = "#fff";
      e.currentTarget.style.border = "1px solid #e5e7eb";
    }}
  >
    <div
      style={{
        ...styles.iconBox,
        backgroundColor: "#eef2ff",
        color: "#4f46e5",
      }}
    >
      <BookOpen size={24} />
    </div>

    <div>
      <p style={styles.statLabel}>Total Library</p>
      <h3 style={styles.statValue}>{resources.length}</h3>
    </div>
  </div>

  <div
    style={styles.statCard}
    onMouseEnter={(e) => {
      e.currentTarget.style.backgroundColor = "#eff6ff";
      e.currentTarget.style.border = "1px solid #3b82f6";
      e.currentTarget.style.transition = "0.3s";
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.backgroundColor = "#fff";
      e.currentTarget.style.border = "1px solid #e5e7eb";
    }}
  >
    <div
      style={{
        ...styles.iconBox,
        backgroundColor: "#f0fdf4",
        color: "#16a34a",
      }}
    >
      <GraduationCap size={24} />
    </div>

    <div>
      <p style={styles.statLabel}>Recent Uploads</p>
      <h3 style={styles.statValue}>
        {
          resources.filter(
            (r) =>
              new Date(r.createdAt) >
              new Date(Date.now() - 7 * 86400000)
          ).length
        }
      </h3>
    </div>
  </div>
          {selectedResources.length > 0 && (
             <div style={{...styles.statCard, border: '1px solid #fee2e2', backgroundColor: '#fef2f2'}} onClick={handleBulkDelete}>
                <div style={{ ...styles.iconBox, backgroundColor: "#ef4444", color: "#fff" }}>
                  <X size={24} />
                </div>
                <div>
                  <p style={{...styles.statLabel, color: '#b91c1c'}}>Delete Selected</p>
                  <h3 style={{...styles.statValue, color: '#b91c1c'}}>{selectedResources.length}</h3>
                </div>
             </div>
          )}
        </div>

        {/* UPLOAD BOX */}
        <div style={styles.uploadSection}>
            <h3 style={styles.sectionHeader}>Add New Material</h3>
            <UploadResource refreshResources={refreshResources} />
        </div>

        {/* CONTENT GRID */}
        <h3 style={styles.sectionHeader}>Material Management</h3>
        <div style={styles.resourceGrid}>
          {filteredResources.map((r) => (
            <AdminResourceCard
              key={r._id}
              resource={r}
              selectedResources={selectedResources}
              handleSelectResource={handleSelectResource}
              handleDelete={handleDelete}
            />
          ))}
        </div>
      </div>

      {/* ... Chat logic ... */}
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


function AdminResourceCard({
  resource,
  selectedResources,
  handleSelectResource,
  handleDelete
}) {

  const isSelected = selectedResources.includes(resource._id);

  const [isEditing, setIsEditing] = useState(false);

  const [formData, setFormData] = useState({
    title: resource.title || "",
    description: resource.description || "",
    subject: resource.subject || ""
  });

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleUpdate = async () => {
    try {

     await axios.put(
  `${API_URL}/api/resources/${resource._id}`,
  formData
);

      alert("Resource updated successfully");

      setIsEditing(false);

      window.location.reload();

    } catch (err) {
      console.error(err);
    }
  };

  return (
   
  <div
    style={{
      ...styles.resourceCard,
      border: isSelected
        ? "2px solid #e54646"
        : "1px solid #4f46e5",
      position: "relative"
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.transform = "translateY(-8px)";
      e.currentTarget.style.boxShadow =
        "0 18px 35px rgba(79,70,229,0.18)";
      e.currentTarget.style.border =
        isSelected
          ? "2px solid #e54646"
          : "1px solid #2563eb";
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.transform = "translateY(0)";
      e.currentTarget.style.boxShadow = "none";
      e.currentTarget.style.border =
        isSelected
          ? "2px solid #e54646"
          : "1px solid #4f46e5";
    }}
  >

      <input
        type="checkbox"
        checked={isSelected}
        onChange={() => handleSelectResource(resource._id)}
        style={styles.checkbox}
      />

      <div style={styles.cardHeader}>
        <div style={styles.authorBadge}>
          {resource.subject || "General"}
        </div>
      </div>

      {isEditing ? (
        <>

          <input
            type="text"
            value={formData.title}
            onChange={(e) =>
              setFormData({
                ...formData,
                title: e.target.value
              })
            }
            placeholder="Title"
            style={styles.input}
          />

          <textarea
            value={formData.description}
            onChange={(e) =>
              setFormData({
                ...formData,
                description: e.target.value
              })
            }
            placeholder="Description"
            style={styles.textarea}
          />

          <input
            type="text"
            value={formData.subject}
            onChange={(e) =>
              setFormData({
                ...formData,
                subject: e.target.value
              })
            }
            placeholder="Subject"
            style={styles.input}
          />

          <button
            style={styles.saveBtn}
            onClick={handleUpdate}
          >
             Save Changes
          </button>

        </>
      ) : (
        <>

          <h4 style={styles.cardTitle}>
            {resource.title}
          </h4>

          <p style={styles.cardDesc}>
            {resource.description}
          </p>

          <p style={styles.subjectText}>
            <span style={{ color: "#4f46e5" }}>
              Subject:
            </span>{" "}
            {resource.subject}
          </p>

          <div style={styles.buttonRow}>

            <button
              style={styles.editBtn}
              onClick={handleEdit}
            >
              Update
            </button>

            <button
              onClick={() => handleDelete(resource._id)}
              style={styles.dangerBtn}
            >
              Delete
            </button>

            <a
              href={resource.fileUrl}
              target="_blank"
              rel="noreferrer"
              style={styles.secondaryBtn}
            >
              View
            </a>

          </div>

        </>
      )}

    </div>
  );
}
// ------------------ ALIGNED STYLES ------------------
const styles = {
  // Global & Layout
  page: {
    minHeight: "100vh",
    backgroundColor: "#f8fafc",
    backgroundImage: `radial-gradient(at 0% 0%, hsla(253,16%,7%,1) 0, transparent 50%), 
                      radial-gradient(at 50% 0%, hsla(225,39%,30%,1) 0, transparent 50%)`,
    backgroundAttachment: "fixed",
    fontFamily: "'Inter', sans-serif",
    paddingBottom: "80px"
  },
  container: { maxWidth: "1100px", margin: "0 auto", padding: "0 20px" },
  topRow: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "30px 0" },
  pageHeader: { display: "flex", alignItems: "center", color: "#fff" },
  
  // Search
  searchWrapper: { position: "relative", width: "300px" },
  searchIcon: { position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#94a3b8", zIndex: 1 },
 
searchBar: {
  width: "30%",
  padding: "10px 15px 10px 40px",
  borderRadius: "0.75rem",
  border: "1px solid #e2e8f0",
  backgroundColor: "rgba(255, 255, 255, 0.9)",
  outline: "none",
  fontSize: "0.9rem",
  transition: "all 0.25s ease"
},

  // Hero Card
  heroCard: {
    padding: "40px", borderRadius: "1.25rem", backgroundColor: "rgba(255, 255, 255, 0.95)",
    backdropFilter: "blur(10px)", border: "1px solid rgba(255,255,255,0.3)", marginBottom: "30px",
    display: "flex", justifyContent: "space-between", alignItems: "center", transition: "all 0.3s ease"
  },
  badge: {
    display: "inline-flex", alignItems: "center", backgroundColor: "#f1f5f9", color: "#4f46e5",
    padding: "5px 12px", borderRadius: "99px", fontSize: "12px", fontWeight: "600", marginBottom: "15px"
  },
  title: { fontSize: "32px", fontWeight: "800", color: "#1e293b", margin: 0 },
  description: { color: "#64748b", marginTop: "10px", fontSize: "16px" },
  heroIllustration: { width: "120px", height: "120px", borderRadius: "50%", background: "linear-gradient(135deg, #4f46e5, #6366f1)", opacity: 0.1 },

  // Stats
  statsGrid: { display: "flex", gap: "20px", marginBottom: "40px" },
  statCard: { 
    flex: 1, backgroundColor: "#fff", padding: "20px", borderRadius: "1rem", 
    display: "flex", alignItems: "center", gap: "15px", border: "1px solid #e2e8f0", transition: "0.25s"
  },
  iconBox: { width: "48px", height: "48px", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center" },
  statLabel: { margin: 0, fontSize: "13px", fontWeight: "500", color: "#64748b" },
  statValue: { margin: 0, fontSize: "24px", fontWeight: "700", color: "#1e293b" },

  // Content
  sectionHeader: { fontSize: "18px", fontWeight: "700", color: "#000", marginBottom: "20px" },
  uploadSection: { 
    backgroundColor: "rgba(255,255,255,0.05)", padding: "25px", borderRadius: "1.25rem", 
    border: "1px solid rgba(255,255,255,0.1)", marginBottom: "40px" 
  },
  resourceGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "20px" },
  resourceCard: {
  backgroundColor: "#fff",
  padding: "25px",
  borderRadius: "1rem",
  display: "flex",
  flexDirection: "column",
  transition: "all 0.3s ease",
  cursor: "pointer"
},
  cardHeader: { display: "flex", justifyContent: "space-between", marginBottom: "15px" },
  authorBadge: { fontSize: "10px", fontWeight: "700", color: "#4f46e5", backgroundColor: "#eef2ff", padding: "4px 8px", borderRadius: "6px" },
  cardTitle: { fontSize: "17px", fontWeight: "700", color: "#1e293b", marginBottom: "8px" },
  cardDesc: { color: "#64748b", fontSize: "14px", marginBottom: "20px", flex: 1 },
  checkbox: { position: 'absolute', top: '15px', right: '15px', cursor: 'pointer' },

  // Buttons
  dangerBtn: { 
    flex: 1, padding: "10px", backgroundColor: "#fee2e2", color: "#dc2626", 
    border: "none", borderRadius: "0.5rem", fontWeight: "600", cursor: "pointer" 
  },
  secondaryBtn: { 
    flex: 1, padding: "10px", backgroundColor: "#f1f5f9", color: "#475569", 
    borderRadius: "0.5rem", textDecoration: "none", fontWeight: "600", textAlign: 'center', fontSize: '14px' 
  },

  // Chat (Matches Ref 1)
   chatFab: {
    position: "fixed", bottom: "30px", right: "30px", width: "60px", height: "60px",
    borderRadius: "50%", backgroundColor: "#4f46e5", color: "#fff", border: "none", cursor: "pointer",
    boxShadow: "0 10px 15px -3px rgba(79, 70, 229, 0.4)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center"
  },
  chatWindow: {
    position: "fixed", bottom: "100px", right: "30px", width: "350px", height: "500px",
    backgroundColor: "#fff", borderRadius: "1.25rem", border: "1px solid #e2e8f0",
    boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)",  zIndex: 9999, display: "flex", flexDirection: "column", overflow: "hidden"
  },
  chatHeader: { padding: "15px 20px", borderBottom: "1px solid #f1f5f9", display: "flex", justifyContent: "space-between", alignItems: "center", backgroundColor: "#f8fafc" },
  closeBtn: { background: "none", border: "none", cursor: "pointer", color: "#64748b" },
  userList: { padding: "10px 15px", display: "flex", gap: "10px",  overflowX: "auto",
  minHeight: "60px",
  flexShrink: 0, borderBottom: "1px solid #f1f5f9" },
  avatar: { 
    width: "40px", height: "40px", borderRadius: "50%", backgroundColor: "#f1f5f9", color: "#4f46e5",
    display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "700", cursor: "pointer", flexShrink: 0, transition: "0.2s"
  },
  chatBody: {
  flex: 1,
  display: "flex",
  flexDirection: "column",
  padding: "15px",
  minWidth: 0,
  minHeight: 0
},
 msgContainer: {
  flex: 1,
  overflowY: "auto",
  overflowX: "hidden",   // 🔥 removes horizontal scroll
  display: "flex",
  flexDirection: "column",
  gap: "10px",
  paddingBottom: "10px",
},
  bubble: { padding: "8px 14px", fontSize: "14px", maxWidth: "80%" , wordBreak: "break-word",   // 🔥 forces long text wrap
  whiteSpace: "pre-wrap" },
  chatInputRow: { display: "flex", gap: "8px", paddingTop: "10px" },
  inputField: { flex: 1, padding: "8px 12px", borderRadius: "0.5rem", border: "1px solid #e2e8f0", outline: "none", fontSize: "14px" },
  sendButton: { backgroundColor: "#4f46e5", color: "#fff", border: "none", borderRadius: "0.5rem", width: "40px", height: "40px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" },
  emptyState: { flex: 1, display: "flex", alignItems: "center", justifyContent: "center", color: "#94a3b8", fontSize: "14px" },

 editBtn: {
  flex: 1,
  padding: "10px",
  backgroundColor: "#4f46e5",
  color: "#fff",
  border: "none",
  borderRadius: "0.5rem",
  fontWeight: "600",
  cursor: "pointer"
},

saveBtn: {
  width: "100%",
  padding: "12px",
  backgroundColor: "#16a34a",
  color: "#fff",
  border: "none",
  borderRadius: "0.5rem",
  fontWeight: "700",
  cursor: "pointer",
  marginTop: "10px"
},

buttonRow: {
  display: "flex",
  gap: "8px",
  marginTop: "15px"
},



textarea: {
  width: "100%",
  minHeight: "80px",
  padding: "10px",
  borderRadius: "0.5rem",
  border: "1px solid #cbd5e1",
  marginBottom: "10px",
  outline: "none",
  resize: "none"
},

subjectText: {
  fontSize: "14px",
  color: "#64748b",
  marginBottom: "15px"
}
};