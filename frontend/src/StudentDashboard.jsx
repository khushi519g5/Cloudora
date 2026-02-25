import { useEffect, useState } from "react";
import axios from "axios";

function Dashboard() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await axios.get(
          "http://localhost:5000/api/auth/profile",
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        setUser(res.data.user);
      } catch (error) {
        console.log(error);
      }
    };

    fetchProfile();
  }, []);

  return (
    <div style={styles.page}>
      {/* NAVBAR */}
      <div style={styles.navbar}>
        <div style={styles.logo}>✨ ResourceHub</div>

        <div style={styles.navRight}>
          <input
            placeholder="Search resources..."
            style={styles.search}
          />

          <button
            style={styles.logoutBtn}
            onMouseEnter={(e) =>
              (e.target.style.background = "rgba(255,255,255,0.1)")
            }
            onMouseLeave={(e) =>
              (e.target.style.background = "transparent")
            }
            onClick={() => {
              localStorage.removeItem("token");
              window.location.href = "/login";
            }}
          >
            Logout
          </button>
        </div>
      </div>

      {/* HERO SECTION */}
      <div style={styles.hero}>
        <p style={styles.subtitle}>
          Welcome back {user?.name || ""} 👋
        </p>
        <h1 style={styles.title}>Your Knowledge Base</h1>
        <p style={styles.description}>
          Organize, access, and share your study resources all in one place.
          Stay ahead with smart resource management.
        </p>
      </div>

     {/* STATS */}
<div style={styles.statsRow}>
  {[
    {
      title: "Resources",
      value: "24",
      change: "+3",
      icon: "📚",
      iconBg: "#1e40af"
    },
    {
      title: "Collections",
      value: "8",
      icon: "📂",
      iconBg: "#2563eb"
    },
    {
      title: "Favorites",
      value: "12",
      icon: "⭐",
      iconBg: "#7c3aed"
    },
    {
      title: "This Week",
      value: "5",
      change: "+2",
      icon: "📈",
      iconBg: "#059669"
    }
  ].map((item, index) => (
    <div key={index} style={styles.statCard}>
      <div style={styles.statTop}>
        <div
          style={{
            ...styles.statIcon,
            background: item.iconBg
          }}
        >
          {item.icon}
        </div>

        <div>
          <p style={styles.statTitle}>{item.title}</p>
          <h2 style={{ marginTop: "5px" }}>
            {item.value}{" "}
            {item.change && (
              <span style={styles.green}>
                {item.change}
              </span>
            )}
          </h2>
        </div>
      </div>
    </div>
  ))}
</div>

      {/* SECTION HEADER */}
      <div style={styles.sectionHeader}>
        <div>
          <h2>Recent Resources</h2>
          <p style={styles.sectionSub}>
            Your latest study materials
          </p>
        </div>

        <button
          style={styles.addBtn}
          onMouseEnter={(e) =>
            (e.target.style.boxShadow =
              "0 12px 35px rgba(59,130,246,0.7)")
          }
          onMouseLeave={(e) =>
            (e.target.style.boxShadow =
              "0 8px 25px rgba(59,130,246,0.5)")
          }
        >
          + Add Resource
        </button>
      </div>

     {/* RESOURCE GRID */}
<div style={styles.grid}>
  {[
    {
      title: "OS Notes",
      desc: "Operating System fundamentals",
      progress: 60,
      gradient: "linear-gradient(135deg, #1e3a8a, #1e293b)",
      iconBg: "#1e40af"
    },
    {
      title: "DBMS Cheatsheet",
      desc: "Database management essentials",
      progress: 75,
      gradient: "linear-gradient(135deg, #065f46, #1f2937)",
      iconBg: "#047857"
    },
    {
      title: "CN Important Qs",
      desc: "Computer Networks prep",
      progress: 90,
      gradient: "linear-gradient(135deg, #3f3f46, #1f2937)",
      iconBg: "#a16207"
    }
  ].map((item, index) => (
    <div
      key={index}
      style={{
        ...styles.resourceCard,
        background: item.gradient
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-8px)";
        e.currentTarget.style.boxShadow =
          "0 20px 40px rgba(59,130,246,0.3)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "none";
      }}
    >
      {/* ICON BADGE */}
      <div
        style={{
          ...styles.iconBadge,
          background: item.iconBg
        }}
      >
        📘
      </div>

      <h3 style={styles.cardTitle}>{item.title}</h3>
      <p style={styles.cardDesc}>{item.desc}</p>

      {/* PROGRESS */}
      <div style={styles.progressWrapper}>
        <div style={styles.progressBar}>
          <div
            style={{
              ...styles.progressFill,
              width: `${item.progress}%`
            }}
          />
        </div>
        <span style={styles.progressText}>
          {item.progress}%
        </span>
      </div>
    </div>
  ))}
</div>

    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    width: "100%",
    padding: "60px 80px",
    fontFamily: "Poppins, sans-serif",
    color: "#ffffff",
    background: `
      radial-gradient(circle at 20% 20%, #1e40af40 0%, transparent 40%),
      radial-gradient(circle at 80% 80%, #2563eb30 0%, transparent 40%),
      #0b1220
    `
  },

  navbar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "60px"
  },

  logo: {
    fontSize: "22px",
    fontWeight: "600"
  },

  navRight: {
    display: "flex",
    gap: "20px",
    alignItems: "center"
  },

  search: {
    padding: "10px 18px",
    borderRadius: "20px",
    border: "1px solid rgba(255,255,255,0.1)",
    background: "rgba(255,255,255,0.05)",
    color: "white",
    outline: "none"
  },

  logoutBtn: {
    padding: "8px 18px",
    borderRadius: "20px",
    border: "1px solid rgba(255,255,255,0.2)",
    background: "transparent",
    color: "white",
    cursor: "pointer",
    transition: "0.3s"
  },

  hero: {
    background: "rgba(30, 58, 138, 0.25)",
    backdropFilter: "blur(20px)",
    padding: "50px",
    borderRadius: "20px",
    border: "1px solid rgba(255,255,255,0.08)",
    boxShadow: "0 0 40px rgba(59,130,246,0.15)",
    marginBottom: "50px"
  },

  subtitle: {
    color: "#60a5fa",
    marginBottom: "10px"
  },

  title: {
    fontSize: "42px",
    marginBottom: "15px"
  },

  description: {
    color: "#94a3b8",
    maxWidth: "600px"
  },

  statsRow: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "25px",
    marginBottom: "60px"
  },

 statCard: {
  background: "rgba(30, 58, 138, 0.2)",
  padding: "30px",
  borderRadius: "22px",
  border: "1px solid rgba(255,255,255,0.08)",
  backdropFilter: "blur(12px)"
},

statTop: {
  display: "flex",
  alignItems: "center",
  gap: "18px"
},

statIcon: {
  width: "55px",
  height: "55px",
  borderRadius: "16px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "24px",
  boxShadow: "0 8px 20px rgba(0,0,0,0.3)"
},


  statTitle: {
    color: "#94a3b8",
    marginBottom: "10px"
  },

  green: {
    color: "#22c55e",
    fontSize: "14px"
  },

  sectionHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "30px",
    paddingBottom: "15px",
    borderBottom: "1px solid rgba(255,255,255,0.08)"
  },

  sectionSub: {
    color: "#94a3b8"
  },

  addBtn: {
    padding: "12px 28px",
    borderRadius: "14px",
    border: "none",
    background: "linear-gradient(135deg, #3b82f6, #2563eb)",
    color: "white",
    cursor: "pointer",
    fontWeight: "600",
    boxShadow: "0 8px 25px rgba(59,130,246,0.5)",
    transition: "0.3s"
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "30px"
  },

 resourceCard: {
  padding: "40px",
  borderRadius: "24px",
  border: "1px solid rgba(255,255,255,0.08)",
  transition: "all 0.3s ease",
  cursor: "pointer",
  position: "relative"
},

iconBadge: {
  width: "60px",
  height: "60px",
  borderRadius: "18px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "24px",
  marginBottom: "25px",
  boxShadow: "0 8px 20px rgba(0,0,0,0.3)"
},

cardTitle: {
  fontSize: "22px",
  marginBottom: "10px"
},

cardDesc: {
  color: "#cbd5e1",
  marginBottom: "30px"
},

progressWrapper: {
  display: "flex",
  alignItems: "center",
  gap: "15px"
},

progressBar: {
  flex: 1,
  height: "6px",
  background: "rgba(255,255,255,0.1)",
  borderRadius: "10px",
  overflow: "hidden"
},

progressFill: {
  height: "100%",
  background: "linear-gradient(90deg, #3b82f6, #60a5fa)",
  borderRadius: "10px"
},

progressText: {
  color: "#94a3b8",
  fontSize: "14px"
},
  resourceDesc: {
    color: "#94a3b8",
    marginTop: "10px"
  }
};

export default Dashboard;
