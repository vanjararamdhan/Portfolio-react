import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

export const alt = "Ramdhan Vanjara — Senior Software Engineer | Node.js, TypeScript & Backend Systems";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const stats = [
  { value: "4.5+", label: "YEARS" },
  { value: "1–2M", label: "RECORDS / DAY" },
  { value: "10", label: "ENGINEERS LED" },
];

export default async function OpengraphImage() {
  const photo = await readFile(join(process.cwd(), "public", "ramdhan-vanjara.jpg"));
  const photoSrc = `data:image/jpeg;base64,${photo.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background: "#0d0d0c",
          color: "#f3f2ed",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", flex: 1, padding: "64px 56px 64px 72px" }}>
          <div style={{ display: "flex", fontSize: 19, letterSpacing: 2, color: "#f2a43a" }}>SENIOR SOFTWARE ENGINEER · BACKEND / FULL STACK</div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: 96, fontFamily: "serif", letterSpacing: -2, lineHeight: 1 }}>Ramdhan</div>
            <div style={{ fontSize: 96, fontFamily: "serif", fontStyle: "italic", color: "#f2a43a", letterSpacing: -2, lineHeight: 1.05 }}>
              Vanjara
            </div>
            <div style={{ marginTop: 28, fontSize: 28, color: "#cdcbc3" }}>Node.js · TypeScript · NestJS · Kafka · AWS</div>
          </div>
          <div style={{ display: "flex", borderTop: "1px solid #3a3a36", paddingTop: 24 }}>
            {stats.map((s, i) => (
              <div key={s.label} style={{ display: "flex", flexDirection: "column", marginRight: 56, paddingLeft: i ? 28 : 0, borderLeft: i ? "1px solid #3a3a36" : "none" }}>
                <div style={{ fontSize: 44, fontFamily: "serif" }}>{s.value}</div>
                <div style={{ fontSize: 16, letterSpacing: 2, color: "#9c9a91" }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
        {/* eslint-disable-next-line @next/next/no-img-element -- ImageResponse renders plain <img> only. */}
        <img src={photoSrc} width={460} height={630} alt="" style={{ objectFit: "cover", objectPosition: "45% 50%" }} />
      </div>
    ),
    size,
  );
}
