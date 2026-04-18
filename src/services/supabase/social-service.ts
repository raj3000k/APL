import { initialSnapshot } from "@/utils/mock-data";
import { STORAGE_KEYS, readStorage, writeStorage } from "@/utils/storage";
import type {
  AuthIdentity,
  ConnectionStatus,
  FanPulseSnapshot,
  NearbyFan,
  ReactionType,
  TeamKey,
} from "@/utils/types";

function cloneSnapshot(snapshot: FanPulseSnapshot) {
  return JSON.parse(JSON.stringify(snapshot)) as FanPulseSnapshot;
}

function getSnapshot() {
  return readStorage<FanPulseSnapshot>(
    STORAGE_KEYS.snapshot,
    cloneSnapshot(initialSnapshot),
  );
}

function saveSnapshot(snapshot: FanPulseSnapshot) {
  writeStorage(STORAGE_KEYS.snapshot, snapshot);
  return snapshot;
}

function generateId(prefix: string) {
  return `${prefix}-${crypto.randomUUID().slice(0, 8)}`;
}

function haversineDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number,
) {
  const toRad = (value: number) => (value * Math.PI) / 180;
  const earthRadius = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;

  return 2 * earthRadius * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function createNotification(
  snapshot: FanPulseSnapshot,
  input: Pick<FanPulseSnapshot["notifications"][number], "userId" | "title" | "body" | "type">,
) {
  snapshot.notifications.unshift({
    id: generateId("notification"),
    createdAt: new Date().toISOString(),
    read: false,
    ...input,
  });
}

export const socialService = {
  async loadBootstrapData() {
    return getSnapshot();
  },

  async syncAuthUser(identity: AuthIdentity) {
    const snapshot = getSnapshot();
    const existing = snapshot.users.find((user) => user.id === identity.id);

    if (!existing) {
      snapshot.users.unshift({
        id: identity.id,
        name: identity.name ?? "",
        avatar:
          identity.avatar ??
          `https://api.dicebear.com/9.x/fun-emoji/svg?seed=${identity.id}`,
        status: "Just joined the stadium",
        fanPoints: 120,
        createdAt: new Date().toISOString(),
      });
      return saveSnapshot(snapshot);
    }

    if (!existing.avatar && identity.avatar) {
      existing.avatar = identity.avatar;
    }

    if (!existing.name && identity.name) {
      existing.name = identity.name;
    }

    return saveSnapshot(snapshot);
  },

  async completeOnboarding(input: {
    userId: string;
    name: string;
    avatar: string;
    team: TeamKey;
  }) {
    const snapshot = getSnapshot();
    const user = snapshot.users.find((entry) => entry.id === input.userId);

    if (!user) {
      throw new Error("User not found");
    }

    user.name = input.name;
    user.avatar = input.avatar;
    user.team = input.team;
    user.status = "Watching Match";

    createNotification(snapshot, {
      userId: user.id,
      title: "Welcome to FanPulse IPL",
      body: `Theme locked to ${input.team}. Loyalty looks good on you.`,
      type: "watch-party",
    });

    return saveSnapshot(snapshot);
  },

  async createPost(input: {
    userId: string;
    caption: string;
    mediaUrl: string;
    mediaType: "image" | "video";
    team?: TeamKey;
    matchTag?: string;
  }) {
    const snapshot = getSnapshot();
    snapshot.posts.unshift({
      id: generateId("post"),
      userId: input.userId,
      caption: input.caption,
      mediaUrl: input.mediaUrl,
      mediaType: input.mediaType,
      team: input.team,
      matchTag: input.matchTag,
      likedBy: [],
      likesCount: 0,
      createdAt: new Date().toISOString(),
      badge: "moment",
    });

    const user = snapshot.users.find((entry) => entry.id === input.userId);
    if (user) {
      user.fanPoints += 18;
    }

    return saveSnapshot(snapshot);
  },

  async toggleLike(input: { postId: string; userId: string }) {
    const snapshot = getSnapshot();
    const post = snapshot.posts.find((entry) => entry.id === input.postId);

    if (!post) {
      throw new Error("Post not found");
    }

    const hasLiked = post.likedBy.includes(input.userId);
    post.likedBy = hasLiked
      ? post.likedBy.filter((id) => id !== input.userId)
      : [...post.likedBy, input.userId];
    post.likesCount = post.likedBy.length;

    if (!hasLiked && post.userId !== input.userId) {
      const actor = snapshot.users.find((user) => user.id === input.userId);
      createNotification(snapshot, {
        userId: post.userId,
        title: "New like",
        body: `${actor?.name ?? "A fan"} liked your post.`,
        type: "like",
      });
    }

    return saveSnapshot(snapshot);
  },

  async addComment(input: { postId: string; userId: string; text: string }) {
    const snapshot = getSnapshot();
    const post = snapshot.posts.find((entry) => entry.id === input.postId);

    if (!post) {
      throw new Error("Post not found");
    }

    snapshot.comments.push({
      id: generateId("comment"),
      postId: input.postId,
      userId: input.userId,
      text: input.text,
      createdAt: new Date().toISOString(),
    });

    const actor = snapshot.users.find((user) => user.id === input.userId);
    createNotification(snapshot, {
      userId: post.userId,
      title: "New comment",
      body: `${actor?.name ?? "A fan"} joined the conversation.`,
      type: "comment",
    });

    return saveSnapshot(snapshot);
  },

  async reactToLiveMatch(input: { userId: string; reaction: ReactionType }) {
    const snapshot = getSnapshot();
    const roomId = `emotion-${input.reaction.toLowerCase()}`;
    let room = snapshot.rooms.find((entry) => entry.id === roomId);

    if (!room) {
      room = {
        id: roomId,
        name: `${input.reaction.replace("_", " ")} Room`,
        type: "emotion",
        emotion: input.reaction,
        participantIds: [],
      };
      snapshot.rooms.unshift(room);
    }

    if (!room.participantIds.includes(input.userId)) {
      room.participantIds.push(input.userId);
    }

    snapshot.messages.push({
      id: generateId("message"),
      roomId,
      userId: input.userId,
      text: `jumped into the ${input.reaction.replace("_", " ")} room.`,
      createdAt: new Date().toISOString(),
    });

    return {
      snapshot: saveSnapshot(snapshot),
      roomId,
    };
  },

  async setTyping(input: { roomId: string; userId: string; isTyping: boolean }) {
    const snapshot = getSnapshot();
    snapshot.typing = snapshot.typing.filter(
      (entry) =>
        !(entry.roomId === input.roomId && entry.userId === input.userId),
    );

    if (input.isTyping) {
      snapshot.typing.push({
        roomId: input.roomId,
        userId: input.userId,
        until: new Date(Date.now() + 3000).toISOString(),
      });
    }

    return saveSnapshot(snapshot);
  },

  async sendMessage(input: { roomId: string; userId: string; text: string }) {
    const snapshot = getSnapshot();
    snapshot.messages.push({
      id: generateId("message"),
      roomId: input.roomId,
      userId: input.userId,
      text: input.text,
      createdAt: new Date().toISOString(),
    });

    snapshot.typing = snapshot.typing.filter(
      (entry) =>
        !(entry.roomId === input.roomId && entry.userId === input.userId),
    );

    return saveSnapshot(snapshot);
  },

  async updateLocation(input: {
    userId: string;
    latitude: number;
    longitude: number;
  }) {
    const snapshot = getSnapshot();
    const user = snapshot.users.find((entry) => entry.id === input.userId);

    if (!user) {
      throw new Error("User not found");
    }

    user.latitude = input.latitude;
    user.longitude = input.longitude;
    user.status = "Watching Match";

    return saveSnapshot(snapshot);
  },

  async getNearbyFans(input: {
    userId: string;
    radiusKm?: number;
  }): Promise<NearbyFan[]> {
    const snapshot = getSnapshot();
    const radiusKm = input.radiusKm ?? 8;
    const currentUser = snapshot.users.find((entry) => entry.id === input.userId);

    if (
      !currentUser?.team ||
      currentUser.latitude === undefined ||
      currentUser.longitude === undefined
    ) {
      return [];
    }

    return snapshot.users
      .filter(
        (entry) =>
          entry.id !== currentUser.id &&
          entry.team === currentUser.team &&
          entry.latitude !== undefined &&
          entry.longitude !== undefined,
      )
      .map((entry) => ({
        ...entry,
        distanceKm: haversineDistance(
          currentUser.latitude!,
          currentUser.longitude!,
          entry.latitude!,
          entry.longitude!,
        ),
      }))
      .filter((entry) => entry.distanceKm <= radiusKm)
      .sort((left, right) => left.distanceKm - right.distanceKm);
  },

  async sendConnectionRequest(input: { senderId: string; receiverId: string }) {
    const snapshot = getSnapshot();
    const existing = snapshot.connections.find(
      (entry) =>
        (entry.senderId === input.senderId &&
          entry.receiverId === input.receiverId) ||
        (entry.senderId === input.receiverId &&
          entry.receiverId === input.senderId),
    );

    if (existing) {
      return saveSnapshot(snapshot);
    }

    snapshot.connections.unshift({
      id: generateId("connection"),
      senderId: input.senderId,
      receiverId: input.receiverId,
      status: "pending",
      createdAt: new Date().toISOString(),
    });

    const actor = snapshot.users.find((entry) => entry.id === input.senderId);
    createNotification(snapshot, {
      userId: input.receiverId,
      title: "New fan request",
      body: `${actor?.name ?? "A fan"} wants to connect.`,
      type: "friend",
    });

    return saveSnapshot(snapshot);
  },

  async respondToConnection(input: {
    connectionId: string;
    status: ConnectionStatus;
  }) {
    const snapshot = getSnapshot();
    const connection = snapshot.connections.find(
      (entry) => entry.id === input.connectionId,
    );

    if (!connection) {
      throw new Error("Connection not found");
    }

    connection.status = input.status;
    if (input.status === "accepted") {
      const roomId = `connection-${connection.senderId}-${connection.receiverId}`;
      if (!snapshot.rooms.some((room) => room.id === roomId)) {
        snapshot.rooms.unshift({
          id: roomId,
          name: "Connection Chat",
          type: "connection",
          participantIds: [connection.senderId, connection.receiverId],
        });
      }
    }

    return saveSnapshot(snapshot);
  },

  async createWatchParty(input: {
    hostId: string;
    title: string;
    inviteeIds: string[];
  }) {
    const snapshot = getSnapshot();
    const roomId = generateId("watch-room");

    snapshot.rooms.unshift({
      id: roomId,
      name: input.title,
      type: "watch-party",
      participantIds: [input.hostId, ...input.inviteeIds],
    });

    snapshot.watchParties.unshift({
      id: generateId("watch-party"),
      hostId: input.hostId,
      title: input.title,
      roomId,
      participantIds: [input.hostId],
      invitedIds: input.inviteeIds,
      createdAt: new Date().toISOString(),
    });

    input.inviteeIds.forEach((userId) => {
      createNotification(snapshot, {
        userId,
        title: "Watch party invite",
        body: `You were invited to ${input.title}.`,
        type: "watch-party",
      });
    });

    return saveSnapshot(snapshot);
  },

  async savePrediction(input: {
    userId: string;
    prediction: "4" | "6" | "wicket";
  }) {
    const snapshot = getSnapshot();
    snapshot.predictions.unshift({
      id: generateId("prediction"),
      userId: input.userId,
      prediction: input.prediction,
      createdAt: new Date().toISOString(),
    });

    const user = snapshot.users.find((entry) => entry.id === input.userId);
    if (user) {
      user.fanPoints += 12;
    }

    return saveSnapshot(snapshot);
  },

  async markNotificationsRead(userId: string) {
    const snapshot = getSnapshot();
    snapshot.notifications = snapshot.notifications.map((entry) =>
      entry.userId === userId ? { ...entry, read: true } : entry,
    );

    return saveSnapshot(snapshot);
  },
};
