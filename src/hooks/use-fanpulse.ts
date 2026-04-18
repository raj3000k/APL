import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { socialService } from "@/services/supabase/social-service";
import type { AuthIdentity, ConnectionStatus, ReactionType, TeamKey } from "@/utils/types";

export const BOOTSTRAP_QUERY_KEY = ["fanpulse", "bootstrap"] as const;

export function useBootstrapData() {
  return useQuery({
    queryKey: BOOTSTRAP_QUERY_KEY,
    queryFn: socialService.loadBootstrapData,
  });
}

export function useNearbyFans(userId?: string) {
  return useQuery({
    queryKey: ["fanpulse", "nearby", userId],
    queryFn: () =>
      userId
        ? socialService.getNearbyFans({ userId })
        : Promise.resolve([]),
    enabled: Boolean(userId),
  });
}

export function useFanPulseActions() {
  const queryClient = useQueryClient();

  const syncSnapshot = (snapshot: unknown) => {
    queryClient.setQueryData(BOOTSTRAP_QUERY_KEY, snapshot);
    void queryClient.invalidateQueries({ queryKey: ["fanpulse", "nearby"] });
  };

  return {
    syncAuthUser: async (identity: AuthIdentity) => {
      const snapshot = await socialService.syncAuthUser(identity);
      syncSnapshot(snapshot);
      return snapshot;
    },
    completeOnboarding: useMutation({
      mutationFn: socialService.completeOnboarding,
      onSuccess: syncSnapshot,
    }),
    createPost: useMutation({
      mutationFn: socialService.createPost,
      onSuccess: syncSnapshot,
    }),
    toggleLike: useMutation({
      mutationFn: socialService.toggleLike,
      onSuccess: syncSnapshot,
    }),
    addComment: useMutation({
      mutationFn: socialService.addComment,
      onSuccess: syncSnapshot,
    }),
    reactToLiveMatch: useMutation({
      mutationFn: socialService.reactToLiveMatch,
      onSuccess: (result) => syncSnapshot(result.snapshot),
    }),
    sendMessage: useMutation({
      mutationFn: socialService.sendMessage,
      onSuccess: syncSnapshot,
    }),
    setTyping: useMutation({
      mutationFn: socialService.setTyping,
      onSuccess: syncSnapshot,
    }),
    updateLocation: useMutation({
      mutationFn: socialService.updateLocation,
      onSuccess: syncSnapshot,
    }),
    sendConnectionRequest: useMutation({
      mutationFn: socialService.sendConnectionRequest,
      onSuccess: syncSnapshot,
    }),
    respondToConnection: useMutation({
      mutationFn: (input: { connectionId: string; status: ConnectionStatus }) =>
        socialService.respondToConnection(input),
      onSuccess: syncSnapshot,
    }),
    createWatchParty: useMutation({
      mutationFn: socialService.createWatchParty,
      onSuccess: syncSnapshot,
    }),
    savePrediction: useMutation({
      mutationFn: socialService.savePrediction,
      onSuccess: syncSnapshot,
    }),
    markNotificationsRead: useMutation({
      mutationFn: socialService.markNotificationsRead,
      onSuccess: syncSnapshot,
    }),
  };
}

export type FanPulseActions = ReturnType<typeof useFanPulseActions>;

export function useReactionRoomTarget(reaction: ReactionType) {
  return `emotion-${reaction.toLowerCase()}`;
}

export function useSelectedTeam(team?: TeamKey) {
  return team;
}
