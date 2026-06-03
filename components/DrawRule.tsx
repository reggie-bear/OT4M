"use client";
import { useInView } from "@/hooks/useInView";

export default function DrawRule({ delay = 0 }: { delay?: number }) {
  const [ref, inView] = useInView();
  return (
    <div ref={ref} style={{ flex: 1, height: "1px", position: "relative", overflow: "hidden" }}>
      <div style={{
        position: "absolute", inset: 0,
        background: "var(--border-light)",
        transform: inView ? "scaleX(1)" : "scaleX(0)",
        transformOrigin: "left center",
        transition: `transform 900ms cubic-bezier(0.16,1,0.3,1) ${delay}ms`,
      }} />
    </div>
  );
}
