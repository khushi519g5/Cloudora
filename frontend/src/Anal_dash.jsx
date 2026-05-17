import React, { useEffect, useState } from "react";
import Navbar from "./admin_navbar";
import {
  Users,
  BookOpen,
  Flame,
  Eye,
  Search,
  TrendingUp,
  BarChart3,
  Activity  ,
} from "lucide-react";

export default function AnalyticsDashboard() {
  const [topResources, setTopResources] = useState([]);
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingStats, setLoadingStats] = useState(true);
  const [chartData, setChartData] = useState([40, 65, 30, 80, 55, 90, 70]);
  const [categoryData, setCategoryData] = useState([]);
  const [search, setSearch] = useState("");
  const [activities, setActivities] = useState([]);
  const [loadingActivity, setLoadingActivity] = useState(true);

const totalActivities = activities.length;

  
 useEffect(() => {
  const fetchActivities = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/activity");
      const data = await res.json();

      setActivities(data);
    } catch (err) {
      console.error("Activity fetch error:", err);
    } finally {
      setLoadingActivity(false);
    }
  };

  fetchActivities();
}, []);

  // FETCH TOP RESOURCES
 const fetchResources = async () => {
  try {
    const res = await fetch("http://localhost:5000/api/resources/");
    const data = await res.json();

    const formatted = data.map((item) => ({
      name: item.title,
      category: item.subject,
      views: item.views ?? 0,
      downloads: item.downloads ?? 0,
    }));

    setTopResources(formatted);

    // ✅ PIE CHART DATA (FIX HERE)
    const categoryMap = {};

    formatted.forEach((item) => {
      categoryMap[item.category] =
        (categoryMap[item.category] || 0) + 1;
    });

    const pieData = Object.keys(categoryMap).map((key) => ({
      name: key,
      value: categoryMap[key],
    }));

    setCategoryData(pieData);
  } catch (err) {
    console.error("Failed to fetch top resources:", err);
  } finally {
    setLoading(false);
  }
};

useEffect(() => {
  fetchResources();
}, []);

  // FETCH ANALYTICS STATS
  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/resources");
        const resources = await res.json();

        const totalViews = resources.reduce(
          (sum, r) => sum + (r.views || 0),
          0
        );

        const totalDownloads = resources.reduce(
          (sum, r) => sum + (r.downloads || 0),
          0
        );

        setStats([
          {
            title: "Total Resources",
            value: resources.length,
            change: "+ updated",
            icon: <BookOpen size={24} />,
          },
          {
            title: "Total Views",
            value: totalViews,
            change: "+ engagement",
            icon: <Eye size={24} />,
          },
          {
            title: "Total Downloads",
            value: totalDownloads,
            change: "+ activity",
            icon: <Flame size={24} />,
          },
          {
  title: "Total Activities",
   value: activities.length, 
  change: "+ live tracking",
  icon: <Activity size={24} />,
}
        ]);
      } catch (err) {
        console.error("Analytics error:", err);
      } finally {
        setLoadingStats(false);
      }
    };

    fetchAnalytics();
 }, [activities]); 

  return (
    <div style={styles.page}>
      <Navbar />

      <div style={styles.container}>
        {/* HEADER */}
        <div style={styles.topRow}>
          <div style={styles.pageHeader}>
            <div style={styles.headerIcon}>
              <BarChart3 size={22} />
            </div>

            <div>
              <h2 style={styles.heading}>Analytics Dashboard</h2>
              <p style={styles.subHeading}>
                Monitor platform activity and insights
              </p>
            </div>
          </div>
        </div>

        {/* STATS */}
        <div style={styles.statsGrid}>
          {loadingStats ? (
            <p style={{ color: "#fff" }}>Loading stats...</p>
          ) : (
            stats.map((stat, index) => (
              <div key={index} style={styles.statCard}>
                <div style={styles.iconBox}>{stat.icon}</div>

                <div>
                  <p style={styles.statLabel}>{stat.title}</p>
                  <h3 style={styles.statValue}>{stat.value}</h3>
                  <span style={styles.statChange}>{stat.change}</span>
                </div>
              </div>
            ))
          )}
        </div>

          {/* CHART */}
<div style={styles.chartGrid}>
  <div style={styles.chartCard}>
    <div style={styles.cardTop}>
      <h3 style={styles.cardHeading}>User Activity</h3>
      <span style={styles.smallText}>Last 7 Days</span>
    </div>

    <div style={styles.chartArea}>
      {(() => {
        // STEP 1: build last 7 days map
        const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
        const counts = Array(7).fill(0);

        activities.forEach((a) => {
          const date = new Date(a.createdAt);
          const day = date.getDay(); // 0 (Sun) - 6 (Sat)
          const mappedIndex = day === 0 ? 6 : day - 1; // convert to Mon-Sun
          counts[mappedIndex]++;
        });

        const max = Math.max(...counts, 1);

        return counts.map((h, i) => (
          <div key={i} style={styles.barWrapper}>
            <div
              style={{
                ...styles.chartBar,
                height: `${(h / max) * 240}px`,
              }}
            />
            <span style={styles.dayLabel}>{days[i]}</span>
          </div>
        ));
      })()}
    </div>
  </div>

<div style={styles.pieCard}>
  <div style={styles.cardTop}>
    <h3 style={styles.cardHeading}>Resources by Category</h3>
  </div>

  <div style={styles.pieWrapper}>
    <svg width="220" height="220" viewBox="0 0 32 32">
      {categoryData.reduce(
        (acc, item, i) => {
          const total = categoryData.reduce(
            (s, d) => s + d.value,
            0
          );

          const value = item.value / total;
          const [start, setStart] = acc;

          const end = start + value;

          const x1 = 16 + 16 * Math.cos(2 * Math.PI * start);
          const y1 = 16 + 16 * Math.sin(2 * Math.PI * start);

          const x2 = 16 + 16 * Math.cos(2 * Math.PI * end);
          const y2 = 16 + 16 * Math.sin(2 * Math.PI * end);

          const largeArc = value > 0.5 ? 1 : 0;

          const path = `
            M 16 16
            L ${x1} ${y1}
            A 16 16 0 ${largeArc} 1 ${x2} ${y2}
            Z
          `;

          acc[1].push(
            <path
              key={i}
              d={path}
              fill={`hsl(${i * 60}, 70%, 55%)`}
            />
          );

          return [end, acc[1]];
        },
        [0, []]
      )[1]}
    </svg>
  </div>

  <div style={styles.legend}>
    {categoryData.map((c, i) => (
      <div key={i} style={styles.legendItem}>
        <span
          style={{
            ...styles.colorBox,
            backgroundColor: `hsl(${i * 60}, 70%, 55%)`,
          }}
        />
        {c.name} ({c.value})
      </div>
    ))}
  </div>
</div>

         {/* TABLE */}
        <div style={styles.tableCard}>
          <div style={styles.cardTop}>
            <h3 style={styles.cardHeading}>Top Resources</h3>

            <div style={styles.searchWrapper}>
              <Search size={16} style={styles.searchIcon} />
             <input
  placeholder="Search resource..."
  style={styles.searchBar}
  value={search}
  onChange={(e) => setSearch(e.target.value)}
/>
            </div>
          </div>

          {loading ? (
            <p>Loading...</p>
          ) : (
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Resource</th>
                  <th style={styles.th}>Views</th>
                  <th style={styles.th}>Downloads</th>
                  <th style={styles.th}>Category</th>
                </tr>
              </thead>

              <tbody>
               {topResources
  .filter((r) =>
    r.name.toLowerCase().includes(search.toLowerCase())
  )
  .map((resource, index) => (
                  <tr key={index}>
                    <td style={styles.td}>{resource.name}</td>
                    <td style={styles.td}>{resource.views}</td>
                    <td style={styles.td}>{resource.downloads}</td>
                    <td style={styles.td}>
                      <span style={styles.categoryBadge}>
                        {resource.category}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>


        {/* ACTIVITY */}
<div style={styles.activityCard}>
  <h3 style={styles.cardHeading}>Recent Activity</h3>

  <div style={styles.activityList}>
    {loadingActivity ? (
      <p>Loading activity...</p>
    ) : (
      activities.map((a, i) => (
        <div key={i} style={styles.activityItem}>
          <div style={styles.activityDot}></div>
          <div>
            <p style={styles.activityText}>{a.message}</p>
            <span style={styles.activityTime}>
              {new Date(a.createdAt).toLocaleTimeString()}
            </span>
          </div>
        </div>
      ))
    )}
  </div>
</div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    backgroundColor: "#f8fafc",
    backgroundImage: `radial-gradient(at 0% 0%, hsla(253,16%,7%,1) 0, transparent 50%), 
    radial-gradient(at 50% 0%, hsla(225,39%,30%,1) 0, transparent 50%)`,
    backgroundAttachment: "fixed",
    fontFamily: "'Inter', sans-serif",
    paddingBottom: "80px",
  },
  pieCard: {
  backgroundColor: "#fff",
  borderRadius: "1.25rem",
  padding: "25px",
  border: "1px solid #e2e8f0",
  boxShadow: "0 10px 25px -5px rgba(0,0,0,0.05)",
  marginBottom: "30px",
},

pieWrapper: {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  margin: "20px 0",
},

legend: {
  display: "flex",
  flexWrap: "wrap",
  gap: "12px",
  justifyContent: "center",
},

legendItem: {
  fontSize: "13px",
  color: "#334155",
  display: "flex",
  alignItems: "center",
  gap: "6px",
},

colorBox: {
  width: "10px",
  height: "10px",
  borderRadius: "3px",
},

  container: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "0 20px",
  },

  topRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "30px 0",
    flexWrap: "wrap",
    gap: "20px",
  },

  pageHeader: {
    display: "flex",
    alignItems: "center",
    gap: "14px",
    color: "#fff",
  },

  headerIcon: {
    width: "50px",
    height: "50px",
    borderRadius: "14px",
    backgroundColor: "rgba(255,255,255,0.1)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backdropFilter: "blur(8px)",
  },

  heading: {
    margin: 0,
    fontSize: "28px",
    fontWeight: "800",
  },

  subHeading: {
    marginTop: "5px",
    color: "#cbd5e1",
    fontSize: "14px",
  },

  filterButtons: {
    display: "flex",
    gap: "10px",
  },

  activeFilterBtn: {
    padding: "10px 18px",
    borderRadius: "12px",
    border: "none",
    backgroundColor: "#4f46e5",
    color: "#fff",
    fontWeight: "600",
    cursor: "pointer",
  },

  filterBtn: {
    padding: "10px 18px",
    borderRadius: "12px",
    border: "1px solid rgba(255,255,255,0.15)",
    backgroundColor: "rgba(255,255,255,0.08)",
    color: "#fff",
    fontWeight: "600",
    cursor: "pointer",
  },

  heroCard: {
    padding: "40px",
    borderRadius: "1.25rem",
    backgroundColor: "rgba(255,255,255,0.95)",
    backdropFilter: "blur(10px)",
    border: "1px solid rgba(255,255,255,0.3)",
    marginBottom: "30px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    boxShadow: "0 10px 25px -5px rgba(0,0,0,0.05)",
    transition: "all 0.3s ease",
    cursor: "pointer",
  },

  badge: {
    display: "inline-flex",
    alignItems: "center",
    backgroundColor: "#eef2ff",
    color: "#4f46e5",
    padding: "5px 12px",
    borderRadius: "99px",
    fontSize: "12px",
    fontWeight: "600",
    marginBottom: "15px",
  },

  heroTitle: {
    fontSize: "32px",
    fontWeight: "800",
    color: "#1e293b",
    margin: 0,
  },

  heroDesc: {
    color: "#64748b",
    marginTop: "10px",
    fontSize: "16px",
    maxWidth: "600px",
  },

  heroIllustration: {
    width: "120px",
    height: "120px",
    borderRadius: "50%",
    background:
      "linear-gradient(135deg, #4f46e5, #6366f1)",
    opacity: 0.12,
  },

  statsGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(240px, 1fr))",
    gap: "20px",
    marginBottom: "30px",
  },

  statCard: {
    backgroundColor: "#fff",
    padding: "22px",
    borderRadius: "1rem",
    display: "flex",
    alignItems: "center",
    gap: "15px",
    border: "1px solid #e2e8f0",
    boxShadow: "0 4px 6px -1px rgba(0,0,0,0.02)",
    transition: "all 0.25s ease",
    cursor: "pointer",
  },

  iconBox: {
    width: "52px",
    height: "52px",
    borderRadius: "14px",
    backgroundColor: "#eef2ff",
    color: "#4f46e5",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  statLabel: {
    margin: 0,
    fontSize: "13px",
    fontWeight: "500",
    color: "#64748b",
  },

  statValue: {
    margin: "4px 0",
    fontSize: "28px",
    fontWeight: "800",
    color: "#1e293b",
  },

  statChange: {
    fontSize: "12px",
    color: "#16a34a",
    fontWeight: "600",
  },

  chartGrid: {
    display: "grid",
    gridTemplateColumns: "2fr 1fr",
    gap: "20px",
    marginBottom: "30px",
  },

  chartCard: {
    backgroundColor: "#fff",
    borderRadius: "1.25rem",
    padding: "25px",
    border: "1px solid #e2e8f0",
    boxShadow: "0 10px 25px -5px rgba(0,0,0,0.05)",
  },

  cardTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "25px",
  },

  cardHeading: {
    margin: 0,
    fontSize: "20px",
    fontWeight: "700",
    color: "#1e293b",
  },

  smallText: {
    fontSize: "13px",
    color: "#64748b",
  },

  chartArea: {
  height: "280px",
  display: "flex",
  alignItems: "flex-end",
  gap: "16px",
  position: "relative",
},

  barWrapper: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "10px",
  },

  chartBar: {
    width: "100%",
    borderRadius: "14px 14px 0 0",
    background:
      "linear-gradient(180deg, #6366f1, #4f46e5)",
    transition: "0.3s",
  },

  dayLabel: {
    fontSize: "12px",
    color: "#64748b",
  },

  circleWrapper: {
    display: "flex",
    justifyContent: "center",
    marginBottom: "25px",
  },

  circleChart: {
    width: "170px",
    height: "170px",
    borderRadius: "50%",
    border: "18px solid #4f46e5",
    borderTopColor: "#8b5cf6",
    borderRightColor: "#22c55e",
    borderBottomColor: "#ec4899",
  },

  categoryList: {
    display: "flex",
    flexDirection: "column",
    gap: "14px",
  },

  categoryItem: {
    display: "flex",
    justifyContent: "space-between",
    color: "#475569",
    fontSize: "14px",
    fontWeight: "600",
  },

  bottomGrid: {
    display: "grid",
    gridTemplateColumns: "2fr 1fr",
    gap: "20px",
  },

  tableCard: {
    backgroundColor: "#fff",
    borderRadius: "1.25rem",
    padding: "25px",
    border: "1px solid #e2e8f0",
    boxShadow: "0 10px 25px -5px rgba(0,0,0,0.05)",
    overflowX: "auto",
  },

  searchWrapper: {
    position: "relative",
    width: "220px",
  },

  searchIcon: {
    position: "absolute",
    left: "12px",
    top: "50%",
    transform: "translateY(-50%)",
    color: "#94a3b8",
  },

  searchBar: {
    width: "100%",
    padding: "10px 15px 10px 38px",
    borderRadius: "0.75rem",
    border: "1px solid #e2e8f0",
    outline: "none",
    fontSize: "14px",
    backgroundColor: "#f8fafc",
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
  },

  th: {
    textAlign: "left",
    paddingBottom: "15px",
    color: "#64748b",
    fontSize: "13px",
    borderBottom: "1px solid #e2e8f0",
  },

  td: {
    padding: "18px 0",
    borderBottom: "1px solid #f1f5f9",
    color: "#1e293b",
    fontWeight: "500",
  },

  tr: {
    transition: "0.2s",
  },

  categoryBadge: {
    padding: "6px 12px",
    borderRadius: "999px",
    backgroundColor: "#eef2ff",
    color: "#4f46e5",
    fontSize: "12px",
    fontWeight: "700",
  },

  activityCard: {
    backgroundColor: "#fff",
    borderRadius: "1.25rem",
    padding: "25px",
    border: "1px solid #e2e8f0",
    boxShadow: "0 10px 25px -5px rgba(0,0,0,0.05)",
  },

  liveDot: {
    width: "10px",
    height: "10px",
    borderRadius: "50%",
    backgroundColor: "#22c55e",
  },

  activityList: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },

  activityItem: {
    display: "flex",
    gap: "12px",
    padding: "14px",
    borderRadius: "14px",
    backgroundColor: "#f8fafc",
    transition: "0.2s",
  },

  activityDot: {
    width: "8px",
    height: "8px",
    borderRadius: "50%",
    backgroundColor: "#4f46e5",
    marginTop: "8px",
  },

  activityText: {
    margin: 0,
    fontSize: "14px",
    color: "#1e293b",
    fontWeight: "500",
  },

  activityTime: {
    fontSize: "12px",
    color: "#94a3b8",
  },
  
};