import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export function AuthPage({
  onSignIn,
  isDemoMode,
}: {
  onSignIn: () => Promise<void>;
  isDemoMode: boolean;
}) {
  return (
    <div className="relative flex min-h-screen items-center overflow-hidden px-4 py-12 sm:px-6 lg:px-8">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,hsla(var(--theme-accent)/0.26),transparent_30%),linear-gradient(135deg,#080b13_0%,#121a2f_55%,#070b12_100%)]" />
      <div className="absolute left-[8%] top-20 h-56 w-56 rounded-full bg-rose-500/10 blur-3xl" />
      <div className="absolute bottom-16 right-[10%] h-72 w-72 rounded-full bg-sky-400/10 blur-3xl" />

      <div className="relative mx-auto grid w-full max-w-7xl gap-10 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/75"
          >
            <Sparkles className="h-4 w-4 text-[hsl(var(--theme-accent-soft))]" />
            Live match reactions, nearby fans, watch parties
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="max-w-3xl font-display text-5xl font-semibold leading-tight text-white sm:text-6xl"
          >
            FanPulse IPL feels like Instagram, Discord, and stadium chaos had a beautiful child.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="max-w-2xl text-lg leading-8 text-white/70"
          >
            Connect through your team loyalty, explode with live reactions, discover nearby fans, and
            build watch parties that feel bigger than a group chat.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="flex flex-col gap-3 sm:flex-row"
          >
            <Button size="lg" onClick={onSignIn}>
              Continue with Google
              <ArrowRight className="h-4 w-4" />
            </Button>
            <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/65">
              {isDemoMode
                ? "Supabase keys missing, so sign-in uses a demo fan session until you add them."
                : "Google auth is powered by Supabase OAuth."}
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-panel overflow-hidden rounded-[2.5rem] p-6"
        >
          <div className="rounded-[2rem] border border-white/10 bg-white/5 p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-white/40">
                  Tonight
                </p>
                <h2 className="mt-2 font-display text-3xl font-semibold">RCB vs MI</h2>
              </div>
              <div className="rounded-full bg-rose-500/20 px-3 py-1 text-sm font-semibold text-rose-200">
                LIVE
              </div>
            </div>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {[
                "Realtime emotion rooms",
                "Nearby fans in 5-10 km radius",
                "Premium match feed",
                "Watch parties and invites",
              ].map((item) => (
                <div key={item} className="rounded-[1.5rem] border border-white/10 bg-black/20 p-4">
                  <p className="text-sm font-medium text-white/85">{item}</p>
                </div>
              ))}
            </div>
            <div className="mt-6 overflow-hidden rounded-[2rem] border border-white/10">
              <img
                src="https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=1200&q=80"
                alt="Cricket stadium crowd"
                className="h-72 w-full object-cover"
              />
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
