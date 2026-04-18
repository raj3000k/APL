import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { TeamIdentity } from "@/components/team-logo";
import { Button } from "@/components/ui/button";

function GoogleMark() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
      <path
        d="M21.8 12.23c0-.79-.07-1.54-.2-2.27H12v4.3h5.49a4.7 4.7 0 0 1-2.04 3.08v2.56h3.3c1.93-1.78 3.05-4.41 3.05-7.67Z"
        fill="#4285F4"
      />
      <path
        d="M12 22c2.76 0 5.08-.92 6.78-2.5l-3.3-2.56c-.92.62-2.09.99-3.48.99-2.67 0-4.93-1.8-5.73-4.22H2.86v2.64A10.23 10.23 0 0 0 12 22Z"
        fill="#34A853"
      />
      <path
        d="M6.27 13.71A6.14 6.14 0 0 1 5.95 12c0-.59.11-1.16.32-1.71V7.65H2.86A10.07 10.07 0 0 0 1.82 12c0 1.64.39 3.2 1.04 4.35l3.41-2.64Z"
        fill="#FBBC05"
      />
      <path
        d="M12 6.06c1.5 0 2.85.52 3.91 1.53l2.93-2.93A9.78 9.78 0 0 0 12 2a10.23 10.23 0 0 0-9.14 5.65l3.41 2.64C7.07 7.86 9.33 6.06 12 6.06Z"
        fill="#EA4335"
      />
    </svg>
  );
}

export function AuthPage({
  onSignIn,
  isDemoMode,
}: {
  onSignIn: () => Promise<void>;
  isDemoMode: boolean;
}) {
  return (
    <div className="relative flex min-h-screen items-center overflow-hidden px-4 py-12 sm:px-6 lg:px-8">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,hsla(var(--theme-accent)/0.22),transparent_26%),linear-gradient(145deg,hsl(var(--theme-shell-start))_0%,hsl(var(--theme-shell-mid))_48%,hsl(var(--theme-shell-end))_100%)]" />
      <div className="absolute left-[8%] top-20 h-56 w-56 rounded-full bg-[hsla(var(--theme-accent-soft)/0.12)] blur-3xl" />
      <div className="absolute bottom-16 right-[10%] h-72 w-72 rounded-full bg-[hsla(var(--theme-via)/0.16)] blur-3xl" />

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
            Built on IPL’s official blue spine, then tuned to every fan base you join.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="max-w-2xl text-lg leading-8 text-white/70"
          >
            Google sign-in gets fans in fast, the IPL color system anchors the product visually, and
            each team shifts the full experience into its own identity after onboarding.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="flex flex-col gap-3 sm:flex-row"
          >
            <Button size="lg" onClick={onSignIn}>
              <GoogleMark />
              Continue with Google
              <ArrowRight className="h-4 w-4" />
            </Button>
            <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/65">
              {isDemoMode
                ? "Supabase keys are still missing, so local demo auth stays enabled until you send them."
                : "Google auth is powered by Supabase OAuth and ready for production setup."}
            </div>
          </motion.div>
          <div className="grid gap-3 sm:grid-cols-3">
            {[
              "IPL base palette from iplt20.com",
              "Team-aware UI after onboarding",
              "Supabase Google OAuth ready",
            ].map((item) => (
              <div key={item} className="rounded-[1.5rem] border border-white/10 bg-white/5 px-4 py-4 text-sm text-white/75">
                {item}
              </div>
            ))}
          </div>
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
                <div className="mt-2 flex items-center gap-3 font-display text-3xl font-semibold">
                  <TeamIdentity team="RCB" logoClassName="h-9 w-9" />
                  <span className="text-white/65">vs</span>
                  <TeamIdentity team="MI" logoClassName="h-9 w-9" />
                </div>
              </div>
              <div className="rounded-full bg-[hsla(var(--theme-accent)/0.2)] px-3 py-1 text-sm font-semibold text-[hsl(var(--theme-accent-soft))]">
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
