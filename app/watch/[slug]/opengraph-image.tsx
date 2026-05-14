import { ImageResponse } from "next/og";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "#000",
          color: "white",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "60px",
        }}
      >
        <div
          style={{
            fontSize: 36,
            marginBottom: 20,
            color: "#22c55e",
          }}
        >
          🎾 Watch Tennis Today
        </div>

        <div
          style={{
            fontSize: 72,
            fontWeight: 900,
            lineHeight: 1.1,
          }}
        >
          Live Tennis Match
        </div>

        <div
          style={{
            fontSize: 36,
            marginTop: 30,
            color: "#a1a1aa",
          }}
        >
          ATP • WTA • Grand Slams
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}