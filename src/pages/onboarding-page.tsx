import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { TeamLogo } from "@/components/team-logo";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { TEAM_OPTIONS } from "@/utils/teams";
import type { AuthIdentity, TeamKey } from "@/utils/types";

const schema = z.object({
  name: z.string().min(2, "Pick a fan name"),
  avatar: z.string().url("Use a valid avatar URL"),
  team: z.string().min(1, "Choose your IPL team"),
});

type FormValues = z.infer<typeof schema>;

export function OnboardingPage({
  authUser,
  onComplete,
}: {
  authUser: AuthIdentity;
  onComplete: (payload: {
    userId: string;
    name: string;
    avatar: string;
    team: TeamKey;
  }) => Promise<unknown>;
}) {
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: authUser.name ?? "",
      avatar:
        authUser.avatar ??
        `https://api.dicebear.com/9.x/fun-emoji/svg?seed=${authUser.id}`,
      team: "",
    },
  });

  const selectedTeam = form.watch("team");

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12">
      <Card className="w-full max-w-3xl overflow-hidden">
        <div className="grid gap-0 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="bg-[linear-gradient(135deg,hsla(var(--theme-accent)/0.35),transparent)] p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/55">
              Onboarding
            </p>
            <h1 className="mt-4 font-display text-4xl font-semibold text-white">
              Loyalty check before kickoff.
            </h1>
            <p className="mt-4 text-white/70">
              Pick your name, upload your avatar, and lock your team theme. One team only.
            </p>
          </div>
          <div>
            <CardHeader>
              <CardTitle>Build your fan identity</CardTitle>
              <CardDescription>
                Multiple teams are not allowed. Sorry, only loyalty here 😤
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="space-y-2">
                <label className="text-sm font-medium text-white/75">Username</label>
                <Input {...form.register("name")} placeholder="ViratEnergy99" />
                <p className="text-xs text-rose-300">{form.formState.errors.name?.message}</p>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-white/75">Avatar URL</label>
                <Input {...form.register("avatar")} placeholder="https://..." />
                <p className="text-xs text-rose-300">{form.formState.errors.avatar?.message}</p>
              </div>
              <div className="space-y-3">
                <label className="text-sm font-medium text-white/75">Choose one IPL team</label>
                <div className="grid gap-3 sm:grid-cols-2">
                  {TEAM_OPTIONS.filter((team): team is typeof team & { key: TeamKey } => Boolean(team.key)).map((team) => (
                    <button
                      key={team.key}
                      type="button"
                      onClick={() => {
                        if (selectedTeam && selectedTeam !== team.key) {
                          toast.error("Sorry, only loyalty here 😤");
                        }
                        form.setValue("team", team.key);
                      }}
                      className={`rounded-[1.5rem] border px-4 py-4 text-left transition ${
                        selectedTeam === team.key
                          ? "border-white/20 bg-white/12"
                          : "border-white/10 bg-white/5 hover:border-white/20"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <TeamLogo team={team.key} className="h-10 w-10" />
                        <div>
                          <p className="font-display text-lg font-semibold">{team.key}</p>
                          <p className="text-xs text-white/55">{team.label}</p>
                        </div>
                      </div>
                      <p className="mt-1 text-xs text-white/60">{team.slogan}</p>
                    </button>
                  ))}
                </div>
                <p className="text-xs text-rose-300">{form.formState.errors.team?.message}</p>
              </div>
              <Button
                className="w-full"
                onClick={form.handleSubmit(async (values) => {
                  await onComplete({
                    userId: authUser.id,
                    name: values.name,
                    avatar: values.avatar,
                    team: values.team as TeamKey,
                  });
                  toast.success("Theme locked. Welcome to the stadium.");
                })}
              >
                Enter FanPulse
              </Button>
            </CardContent>
          </div>
        </div>
      </Card>
    </div>
  );
}
