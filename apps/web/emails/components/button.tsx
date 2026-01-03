import { Link } from "@react-email/components";
import * as React from "react";

interface ButtonProps {
  href: string;
  children: React.ReactNode;
}

export function Button({ href, children }: ButtonProps) {
  return (
    <Link href={href} style={buttonStyle}>
      {children}
    </Link>
  );
}

const buttonStyle: React.CSSProperties = {
  display: "inline-block",
  backgroundColor: "#F97316",
  color: "#ffffff",
  fontSize: "15px",
  fontWeight: "600",
  textDecoration: "none",
  padding: "12px 32px",
  borderRadius: "12px",
  textAlign: "center" as const,
  margin: "24px 0",
  lineHeight: "1.5",
};
