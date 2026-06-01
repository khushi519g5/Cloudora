import { useState } from "react";
import useNotifications from "./hooks/useNotifications";

export default function NotificationBell() {
  const { notifications } = useNotifications();
  const [open, setOpen] = useState(false);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div style={{ position: "relative", display: "inline-block" }}>
      
      {/* Bell Button */}
      <button
        onClick={() => setOpen(!open)}
        style={{
          background: "white",
          border: "1px solid #ddd",
          borderRadius: "50%",
          width: 40,
          height: 40,
          cursor: "pointer",
          position: "relative",
          fontSize: 18,
        }}
      >
        🔔

        {/* Badge */}
        {unreadCount > 0 && (
          <span
            style={{
              position: "absolute",
              top: -5,
              right: -5,
              background: "red",
              color: "white",
              borderRadius: "50%",
              width: 18,
              height: 18,
              fontSize: 11,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {open && (
        <div
          style={{
            position: "absolute",
            right: 0,
            marginTop: 10,
            width: 320,
            background: "white",
            borderRadius: 10,
            boxShadow: "0 10px 25px rgba(0,0,0,0.15)",
            overflow: "hidden",
            zIndex: 1000,
          }}
        >
          
          {/* Header */}
          <div
            style={{
              padding: 12,
              borderBottom: "1px solid #eee",
              fontWeight: "bold",
              background: "#f9f9f9",
            }}
          >
            Notifications
          </div>

          {/* List */}
          <div style={{ maxHeight: 300, overflowY: "auto" }}>
            {notifications.length === 0 ? (
              <div style={{ padding: 15, color: "#777", textAlign: "center" }}>
                No notifications
              </div>
            ) : (
              notifications.map((n) => (
                <div
                  key={n._id}
                  style={{
                    padding: 12,
                    borderBottom: "1px solid #f0f0f0",
                    cursor: "pointer",
                    transition: "0.2s",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.background = "#f5f5f5")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background = "white")
                  }
                >
                  <div style={{ fontWeight: 600, fontSize: 14 }}>
                    {n.title}
                  </div>
                  <div style={{ fontSize: 12, color: "#666", marginTop: 2 }}>
                    {n.message}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}