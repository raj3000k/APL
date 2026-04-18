import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface TrailPoint {
  id: number;
  x: number;
  y: number;
}

export function BallTrailCursor() {
  const [points, setPoints] = useState<TrailPoint[]>([]);

  useEffect(() => {
    const handleMove = (event: MouseEvent) => {
      setPoints((current) =>
        [...current, { id: Date.now(), x: event.clientX, y: event.clientY }].slice(-8),
      );
    };

    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-[70] hidden md:block">
      {points.map((point, index) => (
        <motion.div
          key={point.id}
          className="absolute h-4 w-4 rounded-full border border-white/20 bg-[radial-gradient(circle_at_30%_30%,#fff_0%,#fcd34d_25%,#f59e0b_70%,transparent_100%)] shadow-[0_0_24px_rgba(245,158,11,0.45)]"
          initial={{ opacity: 0.7, scale: 1 }}
          animate={{
            opacity: 0.08,
            scale: 0.45,
            x: point.x,
            y: point.y,
          }}
          transition={{ duration: 0.45 + index * 0.03 }}
          style={{ left: -8, top: -8 }}
        />
      ))}
    </div>
  );
}
