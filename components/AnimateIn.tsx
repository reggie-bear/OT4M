"use client";

import { useEffect, useRef, ReactNode } from "react";

interface AnimateInProps {
  children: ReactNode;
  delay?: number;
  direction?: "up" | "left" | "right" | "fade";
  distance?: number;
  className?: string;
  style?: React.CSSProperties;
  once?: boolean;
}

export default function AnimateIn({
  children,
  delay = 0,
  direction = "up",
  distance = 28,
  className,
  style,
  once = true,
}: AnimateInProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Respect prefers-reduced-motion
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      el.style.opacity = "1";
      return;
    }

    const translateMap = {
      up: `0, ${distance}px`,
      left: `-${distance}px, 0`,
      right: `${distance}px, 0`,
      fade: `0, 0`,
    };

    el.style.opacity = "0";
    el.style.transform = `translate(${translateMap[direction]})`;
    el.style.willChange = "opacity, transform";

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Small delay to ensure paint is done
          setTimeout(() => {
            if (!el) return;
            el.style.transition = `opacity 600ms cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms, transform 600ms cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms`;
            el.style.opacity = "1";
            el.style.transform = "translate(0, 0)";
            el.style.willChange = "auto";
            if (once) observer.unobserve(el);
          }, 16);
        }
      },
      { threshold: 0.08, rootMargin: "0px 0px -40px 0px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [delay, direction, distance, once]);

  return (
    <div ref={ref} className={className} style={style}>
      {children}
    </div>
  );
}
