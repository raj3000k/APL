import { useEffect, useMemo, useState } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "@/auth/auth-provider";
import { AppShell } from "@/components/app-shell";
import { LiveMatchBanner } from "@/components/live-match-banner";
import { StadiumLoader } from "@/components/stadium-loader";
import { useBootstrapData, useFanPulseActions } from "@/hooks/use-fanpulse";
import { useTeamTheme } from "@/hooks/use-team-theme";
import { AuthPage } from "@/pages/auth-page";
import { ChatPage } from "@/pages/chat-page";
import { FeedPage } from "@/pages/feed-page";
import { NearbyPage } from "@/pages/nearby-page";
import { OnboardingPage } from "@/pages/onboarding-page";
import { ProfilePage } from "@/pages/profile-page";
import { WatchPartyPage } from "@/pages/watch-party-page";

export default function App() {
  const { user: authUser, loading: authLoading, signIn, signOut, isDemoMode } = useAuth();
  const bootstrapQuery = useBootstrapData();
  const actions = useFanPulseActions();
  const [syncingAuthUser, setSyncingAuthUser] = useState(false);

  useEffect(() => {
    if (!authUser) {
      return;
    }

    setSyncingAuthUser(true);
    actions
      .syncAuthUser(authUser)
      .catch(() => {
        toast.error("Could not prepare your fan profile.");
      })
      .finally(() => setSyncingAuthUser(false));
  }, [authUser?.id]);

  const currentUser = useMemo(
    () => bootstrapQuery.data?.users.find((user) => user.id === authUser?.id),
    [authUser?.id, bootstrapQuery.data?.users],
  );

  useTeamTheme(currentUser?.team);

  if (authLoading || bootstrapQuery.isLoading || syncingAuthUser) {
    return <StadiumLoader label="Loading stadium energy" />;
  }

  if (!authUser) {
    return <AuthPage isDemoMode={isDemoMode} onSignIn={signIn} />;
  }

  if (!currentUser?.team || !currentUser.name) {
    return (
      <OnboardingPage
        authUser={authUser}
        onComplete={(payload) => actions.completeOnboarding.mutateAsync(payload)}
      />
    );
  }

  return (
    <BrowserRouter>
      <AppShell
        currentUser={currentUser}
        snapshot={bootstrapQuery.data!}
        onSignOut={signOut}
        onMarkNotificationsRead={() =>
          actions.markNotificationsRead.mutateAsync(currentUser.id)
        }
        stickyBanner={
          bootstrapQuery.data?.liveMatch.isLive ? (
            <LiveMatchBanner
              currentUser={currentUser}
              liveMatch={bootstrapQuery.data.liveMatch}
              actions={actions}
            />
          ) : null
        }
      >
        <Routes>
          <Route
            path="/"
            element={
              <FeedPage
                currentUser={currentUser}
                snapshot={bootstrapQuery.data!}
                actions={actions}
              />
            }
          />
          <Route
            path="/nearby"
            element={
              <NearbyPage
                currentUser={currentUser}
                snapshot={bootstrapQuery.data!}
                actions={actions}
              />
            }
          />
          <Route
            path="/chat"
            element={
              <ChatPage
                currentUser={currentUser}
                snapshot={bootstrapQuery.data!}
                actions={actions}
              />
            }
          />
          <Route
            path="/watch-party"
            element={
              <WatchPartyPage
                currentUser={currentUser}
                snapshot={bootstrapQuery.data!}
                actions={actions}
              />
            }
          />
          <Route
            path="/profile"
            element={<ProfilePage currentUser={currentUser} snapshot={bootstrapQuery.data!} />}
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AppShell>
    </BrowserRouter>
  );
}
