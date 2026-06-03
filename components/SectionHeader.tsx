"use client";
import DrawRule from "@/components/DrawRule";

interface SectionHeaderProps {
  label: string;
  ruleDelay?: number;
  action?: React.ReactNode;
}

export default function SectionHeader({ label, ruleDelay = 200, action }: SectionHeaderProps) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "1.5rem", marginBottom: "3.5rem" }}>
      <div style={{
        fontFamily: "var(--font-body)",
        fontSize: "0.65rem", fontWeight: 600,
        letterSpacing: "0.22em", textTransform: "uppercase",
        color: "var(--accent)", whiteSpace: "nowrap",
      }}>
        {label}
      </div>
      <DrawRule delay={ruleDelay} />
      {action && <div style={{ flexShrink: 0 }}>{action}</div>}
    </div>
  );
}
