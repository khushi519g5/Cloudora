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
  Activity,
} from "lucide-react";
const API_URL = import.meta.env.VITE_API_URL;

export default function AnalyticsDashboard() {
  const [topResources, setTopResources] = useState([]);
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingStats, setLoadingStats] = useState(true);
  const [categoryData, setCategoryData] = useState([]);
  const [search, setSearch] = useState("");
  const [activities, setActivities] = useState([]);
  const [loadingActivity, setLoadingActivity] = useState(true);

  // FETCH ACTIVITIES
  useEffect(() => {
    const fetchActivities = async () => {
      try {
       const res = await fetch(`${API_URL}/api/activity`);
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

  // FETCH RESOURCES & PIE DATA
  const fetchResources = async () => {
    try {
    const res = await fetch(`${API_URL}/api/resources/`);
      const data = await res.json();
      const formatted = data.map((item) => ({
        name: item.title,
        category: item.subject,
        views: item.views ?? 0,
        downloads: item.downloads ?? 0,
      }));
      setTopResources(formatted);

      const categoryMap = {};
      formatted.forEach((item) => {
        categoryMap[item.category] = (categoryMap[item.category] || 0) + 1;
      });
      setCategoryData(Object.keys(categoryMap).map(key => ({ name: key, value: categoryMap[key] })));
    } catch (err) {
      console.error("Failed to fetch top resources:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchResources(); }, []);

  // UPDATE STATS
  useEffect(() => {
    const updateStats = () => {
      const totalViews = topResources.reduce((sum, r) => sum + r.views, 0);
      const totalDownloads = topResources.reduce((sum, r) => sum + r.downloads, 0);

      setStats([
        { title: "Total Resources", value: topResources.length, change: "+ updated", icon: <BookOpen size={24} /> },
        { title: "Total Views", value: totalViews, change: "+ engagement", icon: <Eye size={24} /> },
        { title: "Total Downloads", value: totalDownloads, change: "+ activity", icon: <Flame size={24} /> },
        { title: "Total Activities", value: activities.length, change: "+ live tracking", icon: <Activity size={24} /> }
      ]);
      setLoadingStats(false);
    };
    if (!loading) updateStats();
  }, [activities, topResources, loading]);

  return (
    <div style={styles.page}>
      {/* Responsive Breakpoints Injector */}
      <style>{`
        @media (max-width: 992px) {
          .responsive-grid { grid-template-columns: 1fr !important; }
          .header-row { flex-direction: column; align-items: flex-start !important; }
        }
        @media (max-width: 600px) {
          .stat-card { padding: 15px !important; }
          .chart-area { gap: 8px !important; }
        }
      `}</style>

      <Navbar />

      <div style={styles.container}>
        {/* HEADER */}
        <div className="header-row" style={styles.topRow}>
          <div style={styles.pageHeader}>
            <div style={styles.headerIcon}><BarChart3 size={22} /></div>
            <div>
              <h2 style={styles.heading}>Analytics Dashboard</h2>
              <p style={styles.subHeading}>Monitor platform activity and insights</p>
            </div>
          </div>
        </div>

        {/* STATS GRID */}
        <div style={styles.statsGrid}>
          {loadingStats ? (
            <p style={{ color: "#fff" }}>Loading stats...</p>
          ) : (
            stats.map((stat, index) => (
              <div key={index} className="stat-card" style={styles.statCard}>
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

        {/* CHARTS ROW */}
        <div className="responsive-grid" style={styles.chartGrid}>
          <div style={styles.chartCard}>
            <div style={styles.cardTop}>
              <h3 style={styles.cardHeading}>User Activity</h3>
              <span style={styles.smallText}>Last 7 Days</span>
            </div>
            <div className="chart-area" style={styles.chartArea}>
              {(() => {
                const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
                const counts = Array(7).fill(0);
                activities.forEach((a) => {
                  const day = new Date(a.createdAt).getDay();
                  counts[day === 0 ? 6 : day - 1]++;
                });
                const max = Math.max(...counts, 1);
                return counts.map((h, i) => (
                  <div key={i} style={styles.barWrapper}>
                    <div style={{ ...styles.chartBar, height: `${(h / max) * 100}%` }} />
                    <span style={styles.dayLabel}>{days[i]}</span>
                  </div>
                ));
              })()}
            </div>
          </div>

          <div style={styles.pieCard}>
            <h3 style={styles.cardHeading}>Categories</h3>
            <div style={styles.pieWrapper}>
              <svg width="160" height="160" viewBox="0 0 32 32">
                {categoryData.reduce((acc, item, i) => {
                  const total = categoryData.reduce((s, d) => s + d.value, 0);
                  const value = item.value / total;
                  const [start, paths] = acc;
                  const end = start + value;
                  const x1 = 16 + 16 * Math.cos(2 * Math.PI * start);
                  const y1 = 16 + 16 * Math.sin(2 * Math.PI * start);
                  const x2 = 16 + 16 * Math.cos(2 * Math.PI * end);
                  const y2 = 16 + 16 * Math.sin(2 * Math.PI * end);
                  const path = `M 16 16 L ${x1} ${y1} A 16 16 0 ${value > 0.5 ? 1 : 0} 1 ${x2} ${y2} Z`;
                  paths.push(<path key={i} d={path} fill={`hsl(${i * 60}, 70%, 55%)`} />);
                  return [end, paths];
                }, [0, []])[1]}
              </svg>
            </div>
            <div style={styles.legend}>
              {categoryData.map((c, i) => (
                <div key={i} style={styles.legendItem}>
                  <span style={{ ...styles.colorBox, backgroundColor: `hsl(${i * 60}, 70%, 55%)` }} />
                  {c.name}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* BOTTOM ROW (TABLE & ACTIVITY) */}
        <div className="responsive-grid" style={styles.chartGrid}>
          <div style={styles.tableCard}>
            <div style={styles.cardTop}>
              <h3 style={styles.cardHeading}>Top Resources</h3>
              <div style={styles.searchWrapper}>
                <Search size={16} style={styles.searchIcon} />
                <input
                  placeholder="Search..."
                  style={styles.searchBar}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>
            <div style={{ overflowX: "auto" }}>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>Resource</th>
                    <th style={styles.th}>Views</th>
                    <th style={styles.th}>Category</th>
                  </tr>
                </thead>
                <tbody>
                  {topResources.filter(r => r.name.toLowerCase().includes(search.toLowerCase())).map((resource, index) => (
                    <tr key={index}>
                      <td style={styles.td}>{resource.name}</td>
                      <td style={styles.td}>{resource.views}</td>
                      <td style={styles.td}><span style={styles.categoryBadge}>{resource.category}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div style={styles.activityCard}>
            <h3 style={styles.cardHeading}>Recent Activity</h3>
            <div style={styles.activityList}>
              {activities.slice(0, 5).map((a, i) => (
                <div key={i} style={styles.activityItem}>
                  <div style={styles.activityDot} />
                  <div>
                    <p style={styles.activityText}>{a.message}</p>
                    <span style={styles.activityTime}>{new Date(a.createdAt).toLocaleTimeString()}</span>
                  </div>
                </div>
              ))}
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
  width: "100%",            // Ensure it takes full width
  overflowX: "hidden",      // 👈 This cuts off any accidental horizontal scrolling/margins
  backgroundColor: "#f8fafc",
  backgroundImage: `radial-gradient(at 0% 0%, hsla(253,16%,7%,1) 0, transparent 50%), 
  radial-gradient(at 50% 0%, hsla(225,39%,30%,1) 0, transparent 50%)`,
  backgroundAttachment: "fixed",
  fontFamily: "'Inter', sans-serif",
  paddingBottom: "80px",
},
container: { maxWidth: "1200px", margin: "0 auto", padding: "0 15px" },
  topRow: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "30px 0", gap: "20px" },
  pageHeader: { display: "flex", alignItems: "center", gap: "14px", color: "#fff" },
  headerIcon: { width: "50px", height: "50px", borderRadius: "14px", backgroundColor: "rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center", backdropFilter: "blur(8px)" },
  heading: { margin: 0, fontSize: "clamp(20px, 5vw, 28px)", fontWeight: "800" },
  subHeading: { marginTop: "5px", color: "#cbd5e1", fontSize: "14px" },
  statsGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "15px", marginBottom: "30px" },
  statCard: { backgroundColor: "#fff", padding: "20px", borderRadius: "1rem", display: "flex", alignItems: "center", gap: "15px", border: "1px solid #e2e8f0" },
  iconBox: { minWidth: "48px", height: "48px", borderRadius: "12px", backgroundColor: "#eef2ff", color: "#4f46e5", display: "flex", alignItems: "center", justifyContent: "center" },
  statLabel: { margin: 0, fontSize: "12px", color: "#64748b" },
  statValue: { margin: "2px 0", fontSize: "24px", fontWeight: "800", color: "#1e293b" },
  statChange: { fontSize: "11px", color: "#16a34a" },
  chartGrid: { display: "grid", gridTemplateColumns: "2.2fr 1fr", gap: "20px", marginBottom: "30px" },
  chartCard: { backgroundColor: "#fff", borderRadius: "1.25rem", padding: "20px", border: "1px solid #e2e8f0" },
  pieCard: { backgroundColor: "#fff", borderRadius: "1.25rem", padding: "20px", border: "1px solid #e2e8f0", textAlign: "center" },
  cardTop: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", gap: "10px", flexWrap: "wrap" },
  cardHeading: { fontSize: "18px", fontWeight: "700", color: "#1e293b" },
  chartArea: { height: "200px", display: "flex", alignItems: "flex-end", gap: "12px" },
  barWrapper: { flex: 1, display: "flex", flexDirection: "column", height: "100%", justifyContent: "flex-end", alignItems: "center", gap: "8px" },
  chartBar: { width: "100%", maxWidth: "35px", borderRadius: "6px 6px 0 0", background: "linear-gradient(180deg, #6366f1, #4f46e5)" },
  dayLabel: { fontSize: "11px", color: "#94a3b8" },
  tableCard: { backgroundColor: "#fff", borderRadius: "1.25rem", padding: "20px", border: "1px solid #e2e8f0" },
  searchWrapper: { position: "relative", minWidth: "150px" },
  searchBar: { width: "100%", padding: "8px 12px 8px 35px", borderRadius: "8px", border: "1px solid #e2e8f0", fontSize: "14px" },
  searchIcon: { position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)", color: "#94a3b8" },
  table: { width: "100%", borderCollapse: "collapse", minWidth: "400px" },
  th: { textAlign: "left", padding: "12px 8px", color: "#64748b", fontSize: "12px", borderBottom: "1px solid #e2e8f0" },
  td: { padding: "12px 8px", fontSize: "14px", borderBottom: "1px solid #f1f5f9" },
  categoryBadge: { padding: "4px 8px", borderRadius: "6px", backgroundColor: "#eef2ff", color: "#4f46e5", fontSize: "11px", fontWeight: "700" },
  activityCard: { backgroundColor: "#fff", borderRadius: "1.25rem", padding: "20px", border: "1px solid #e2e8f0" },
  activityList: { display: "flex", flexDirection: "column", gap: "12px" },
  activityItem: { display: "flex", gap: "10px", padding: "10px", borderRadius: "10px", backgroundColor: "#f8fafc" },
  activityDot: { width: "8px", height: "8px", borderRadius: "50%", backgroundColor: "#4f46e5", marginTop: "5px" },
  activityText: { margin: 0, fontSize: "13px", color: "#1e293b" },
  activityTime: { fontSize: "11px", color: "#94a3b8" },
  pieWrapper: { margin: "20px 0" },
  legend: { display: "flex", flexWrap: "wrap", gap: "8px", justifyContent: "center" },
  legendItem: { fontSize: "12px", display: "flex", alignItems: "center", gap: "5px" },
  colorBox: { width: "8px", height: "8px", borderRadius: "2px" },
};