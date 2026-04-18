import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type PropsWithChildren,
} from "react";
import type { Session } from "@supabase/supabase-js";
import { getDefaultDemoUser, getDemoSession, signInWithGoogle, signOutUser } from "@/services/supabase/auth";
import { supabase } from "@/services/supabase/client";
import type { AuthIdentity } from "@/utils/types";

interface AuthContextValue {
  user: AuthIdentity | null;
  loading: boolean;
  isDemoMode: boolean;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function toIdentity(session: Session | null): AuthIdentity | null {
  if (!session) {
    return null;
  }

  return {
    id: session.user.id,
    email: session.user.email,
    name:
      session.user.user_metadata.full_name ??
      session.user.user_metadata.name ??
      session.user.email?.split("@")[0],
    avatar: session.user.user_metadata.avatar_url,
  };
}

export function AuthProvider({ children }: PropsWithChildren) {
  const [user, setUser] = useState<AuthIdentity | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!supabase) {
      setUser(getDemoSession());
      setLoading(false);
      return;
    }

    supabase.auth.getSession().then(({ data }) => {
      setUser(toIdentity(data.session));
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(toIdentity(session));
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      loading,
      isDemoMode: !supabase,
      signIn: async () => {
        await signInWithGoogle();
        if (!supabase) {
          setUser(getDemoSession() ?? getDefaultDemoUser());
        }
      },
      signOut: async () => {
        await signOutUser();
        if (!supabase) {
          setUser(null);
        }
      },
    }),
    [loading, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
}
