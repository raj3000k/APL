import type { AuthIdentity } from "@/utils/types";
import { supabase } from "@/services/supabase/client";
import { STORAGE_KEYS, readStorage, writeStorage } from "@/utils/storage";

const demoUser: AuthIdentity = {
  id: "demo-fan",
  email: "demo@fanpulse.local",
  name: "Powerplay Pioneer",
  avatar: "https://api.dicebear.com/9.x/fun-emoji/svg?seed=Powerplay",
};

export async function signInWithGoogle() {
  if (supabase) {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo:
          import.meta.env.VITE_SUPABASE_REDIRECT_URL ??
          `${window.location.origin}/`,
        queryParams: {
          access_type: "offline",
          prompt: "select_account",
        },
      },
    });

    return;
  }

  writeStorage(STORAGE_KEYS.auth, demoUser);
}

export async function signOutUser() {
  if (supabase) {
    await supabase.auth.signOut();
    return;
  }

  localStorage.removeItem(STORAGE_KEYS.auth);
}

export function getDemoSession() {
  return readStorage<AuthIdentity | null>(STORAGE_KEYS.auth, null);
}

export function getDefaultDemoUser() {
  return demoUser;
}
