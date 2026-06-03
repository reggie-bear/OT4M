"use client";
import { useInView } from "@/hooks/useInView";

interface MaskHeadlineProps {
  lines: string[];
  size: string;
  stagger?: number;
  delay?: number;
  color?: string;
  as?: "h1" | "h2" | "h3";
}

export default function MaskHeadline({
  lines,
  size,
  stagger = 110,
  delay = 0,
  color = "var(--text)",
  as: Tag = "h2",
}: MaskHeadlineProps) {
  const [ref, inView] = useInView(0.15);
  return (
    <Tag
      ref={ref}
      style={{ margin: 0 }}
      aria-label={lines.join(" ")}
    >
      {lines.map((line, i) => (
        <span key={i} style={{ display: "block", overflow: "hidden", lineHeight: 0.92 }}>
          <span style={{
            display: "block",
            fontFamily: "var(--font-display)",
            fontSize: size,
            letterSpacing: "0.01em",
            color,
            transform: inView ? "translateY(0)" : "translateY(108%)",
            transition: `transform 750ms cubic-bezier(0.16,1,0.3,1) ${delay + i * stagger}ms`,
          }}>
            {line}
          </span>
        </span>
      ))}
    </Tag>
  );
}
