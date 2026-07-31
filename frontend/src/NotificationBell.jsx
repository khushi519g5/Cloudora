import { useState, useEffect } from "react";
import useNotifications from "./hooks/useNotifications";

export default function NotificationBell() {
  const { notifications } = useNotifications();
  const [open, setOpen] = useState(false);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClick = (e) => {
      if (!e.target.closest(".notification-wrapper")) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div
      className="notification-wrapper"
      style={{
        position: "relative",
        display: "inline-flex",
        alignItems: "center",
      }}
    >
      {/* Bell Button */}
      <button
        onClick={() => setOpen((prev) => !prev)}
        style={{
          background: "#fff",
          border: "1px solid #ddd",
          borderRadius: "50%",
          width: "42px",
          height: "42px",
          cursor: "pointer",
          position: "relative",
          fontSize: "18px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
        }}
      >
        🔔

        {unreadCount > 0 && (
          <span
            style={{
              position: "absolute",
              top: "-5px",
              right: "-5px",
              background: "#ef4444",
              color: "#fff",
              borderRadius: "50%",
              minWidth: "20px",
              height: "20px",
              padding: "0 5px",
              fontSize: "11px",
              fontWeight: "600",
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
            position: "fixed",
            top: "72px",
            right: "16px",
            width: "360px",
            maxWidth: "calc(100vw - 24px)",
            background: "#fff",
            borderRadius: "12px",
            boxShadow: "0 12px 30px rgba(0,0,0,0.18)",
            border: "1px solid #e5e7eb",
            overflow: "hidden",
            zIndex: 999999,
          }}
        >
          {/* Header */}
          <div
            style={{
              padding: "14px 16px",
              fontWeight: "600",
              fontSize: "16px",
              borderBottom: "1px solid #e5e7eb",
              background: "#fafafa",
            }}
          >
            Notifications
          </div>

          {/* Notification List */}
          <div
            style={{
              maxHeight: "350px",
              overflowY: "auto",
            }}
          >
            {notifications.length === 0 ? (
              <div
                style={{
                  padding: "20px",
                  textAlign: "center",
                  color: "#777",
                }}
              >
                No notifications
              </div>
            ) : (
              notifications.map((n) => (
                <div
                  key={n._id}
                  style={{
                    padding: "14px 16px",
                    borderBottom: "1px solid #f1f1f1",
                    cursor: "pointer",
                    transition: "background 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "#f8fafc";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "#fff";
                  }}
                >
                  <div
                    style={{
                      fontWeight: 600,
                      fontSize: "14px",
                      color: "#111827",
                    }}
                  >
                    {n.title}
                  </div>

                  <div
                    style={{
                      marginTop: "4px",
                      color: "#6b7280",
                      fontSize: "13px",
                      lineHeight: "1.5",
                      wordBreak: "break-word",
                    }}
                  >
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