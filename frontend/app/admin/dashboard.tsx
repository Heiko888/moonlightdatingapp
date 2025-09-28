import React from "react";

const stats = [
    { label: "Benutzer", value: 120 },
    { label: "Aktive Sitzungen", value: 15 },
    { label: "Neue Anmeldungen", value: 8 },
    { label: "Support-Anfragen", value: 3 },
];

const recentActivities = [
    { time: "09:15", activity: "Neuer Benutzer registriert" },
    { time: "10:02", activity: "Support-Anfrage erhalten" },
    { time: "11:30", activity: "Dashboard aktualisiert" },
];

export default function Dashboard() {
    return (
        <div style={{ padding: "2rem", fontFamily: "sans-serif" }}>
            <h1>Admin Dashboard</h1>
            <section style={{ display: "flex", gap: "2rem", marginBottom: "2rem" }}>
                {stats.map((stat) => (
                    <div
                        key={stat.label}
                        style={{
                            background: "#f5f5f5",
                            padding: "1rem 2rem",
                            borderRadius: "8px",
                            boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                            minWidth: "150px",
                            textAlign: "center",
                        }}
                    >
                        <div style={{ fontSize: "2rem", fontWeight: "bold" }}>{stat.value}</div>
                        <div style={{ color: "#555" }}>{stat.label}</div>
                    </div>
                ))}
            </section>
            <section>
                <h2>Letzte Aktivitäten</h2>
                <ul style={{ listStyle: "none", padding: 0 }}>
                    {recentActivities.map((item, idx) => (
                        <li
                            key={idx}
                            style={{
                                background: "#fff",
                                marginBottom: "0.5rem",
                                padding: "0.75rem 1rem",
                                borderRadius: "6px",
                                boxShadow: "0 1px 4px rgba(0,0,0,0.03)",
                                display: "flex",
                                alignItems: "center",
                            }}
                        >
                            <span style={{ fontWeight: "bold", marginRight: "1rem", color: "#888" }}>
                                {item.time}
                            </span>
                            <span>{item.activity}</span>
                        </li>
                    ))}
                </ul>
            </section>
        </div>
    );
}
