import Lottie from "lottie-react";
import pulseAnimation from "@/animations/pulse-lottie.json";

export function StadiumLoader({ label }: { label: string }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top,hsla(var(--theme-accent)/0.3),transparent_35%),linear-gradient(135deg,#090b14_0%,#121931_45%,#070b12_100%)] px-6">
      <div className="glass-panel glow-ring flex max-w-md flex-col items-center rounded-[2rem] px-10 py-12 text-center">
        <div className="h-24 w-24">
          <Lottie animationData={pulseAnimation} loop />
        </div>
        <h1 className="mt-4 font-display text-3xl font-semibold">FanPulse IPL</h1>
        <p className="mt-2 text-sm text-white/70">{label}</p>
      </div>
    </div>
  );
}
