import { ImageResponse } from "next/og";

export const alt = "Ramdhan Vanjara — Senior Software Engineer | Node.js, TypeScript & Backend Systems";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const flow = ["API", "Services", "Kafka", "Consumers", "Master DB"];

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          background: "radial-gradient(ellipse at 50% 0%, #2a1a4f 0%, #09090b 62%)",
          color: "#fafafa",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 14, fontSize: 24, color: "#a78bfa", letterSpacing: 3 }}>
          SENIOR SOFTWARE ENGINEER · BACKEND / FULL STACK
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{ fontSize: 76, fontWeight: 700, letterSpacing: -2 }}>Ramdhan Vanjara</div>
          <div style={{ fontSize: 34, color: "#a1a1aa", maxWidth: 980 }}>
            Node.js · TypeScript · Microservices · Event-driven systems on Kafka · AWS / Azure
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          {flow.map((step, i) => (
            <div key={step} style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <div
                style={{
                  display: "flex",
                  padding: "12px 20px",
                  borderRadius: 12,
                  fontSize: 24,
                  border: i === 2 ? "2px solid #a78bfa" : "2px solid #3f3f46",
                  color: i === 2 ? "#c4b5fd" : "#fafafa",
                  background: "#18181b",
                }}
              >
                {step}
              </div>
              {i < flow.length - 1 && <div style={{ display: "flex", fontSize: 26, color: "#a78bfa" }}>→</div>}
            </div>
          ))}
        </div>
      </div>
    ),
    size,
  );
}
