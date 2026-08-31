"use client";

import { useEffect, useRef, type ReactNode } from "react";

/* 물방울 등장 — scale 0.85 → 1 + 페이드, 부드러운 이징.
   IntersectionObserver 로 뷰포트 진입 시 발동, delay 로 stagger.
   prefers-reduced-motion 존중. */
export function DropletReveal({
  children,
  delay = 0,
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const outerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const outer = outerRef.current;
    const inner = innerRef.current;
    if (!outer || !inner) return;

    const reveal = () => {
      inner.style.opacity = "1";
      inner.style.transform = "translate(0,0) scale(1)";
    };

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      reveal();
      return;
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          reveal();
          io.disconnect();
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -8% 0px" }
    );
    io.observe(outer);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={outerRef} className={className}>
      <div
        ref={innerRef}
        className="h-full"
        style={{
          transition:
            "opacity 0.5s ease, transform 0.5s cubic-bezier(0.22,1,0.36,1)",
          transitionDelay: `${delay}ms`,
          opacity: 0,
          transform: "translate(0,0) scale(0.85)",
          willChange: "opacity, transform",
        }}
      >
        {children}
      </div>
    </div>
  );
}
