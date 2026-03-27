import type { CSSProperties } from "react";

export const btnStyle: CSSProperties = {
  padding: "5px 14px",
  borderRadius: 6,
  border: "1px solid #DDD",
  background: "#fff",
  cursor: "pointer",
  fontSize: 12,
  fontWeight: 500,
  color: "#555",
  display: "inline-flex",
  alignItems: "center",
  gap: 5,
};

export const btnActiveStyle: CSSProperties = {
  ...btnStyle,
  background: "#222",
  color: "#fff",
  borderColor: "#222",
};

export const btnDangerStyle: CSSProperties = {
  ...btnStyle,
  color: "#E85D3A",
  borderColor: "#E85D3A",
};
