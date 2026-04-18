export type TeamKey =
  | "RCB"
  | "MI"
  | "CSK"
  | "KKR"
  | "SRH"
  | "RR"
  | "DC"
  | "PBKS"
  | "GT"
  | "LSG";

export type PostBadge = "moment" | "crowd";

export type MediaType = "image" | "video";

export type ReactionType = "SIX" | "WICKET" | "CLOSE_CALL" | "UMPIRE";

export type ConnectionStatus = "pending" | "accepted" | "rejected";

export interface UserProfile {
  id: string;
  name: string;
  avatar: string;
  team?: TeamKey;
  latitude?: number;
  longitude?: number;
  status: string;
  fanPoints: number;
  createdAt: string;
}

export interface Comment {
  id: string;
  postId: string;
  userId: string;
  text: string;
  createdAt: string;
}

export interface Post {
  id: string;
  userId: string;
  mediaUrl: string;
  mediaType: MediaType;
  caption: string;
  team?: TeamKey;
  matchTag?: string;
  likedBy: string[];
  likesCount: number;
  createdAt: string;
  badge?: PostBadge;
}

export interface ChatRoom {
  id: string;
  name: string;
  type: "team" | "match" | "emotion" | "connection" | "watch-party";
  team?: TeamKey;
  emotion?: ReactionType;
  participantIds: string[];
  matchLabel?: string;
}

export interface Message {
  id: string;
  roomId: string;
  userId: string;
  text: string;
  createdAt: string;
}

export interface Connection {
  id: string;
  senderId: string;
  receiverId: string;
  status: ConnectionStatus;
  createdAt: string;
}

export interface NotificationItem {
  id: string;
  userId: string;
  title: string;
  body: string;
  type: "like" | "comment" | "friend" | "nearby" | "watch-party";
  createdAt: string;
  read: boolean;
}

export interface WatchParty {
  id: string;
  hostId: string;
  title: string;
  roomId: string;
  participantIds: string[];
  invitedIds: string[];
  createdAt: string;
}

export interface Prediction {
  id: string;
  userId: string;
  prediction: "4" | "6" | "wicket";
  createdAt: string;
}

export interface LiveMatch {
  id: string;
  homeTeam: TeamKey;
  awayTeam: TeamKey;
  isLive: boolean;
  startedAt: string;
  matchLabel: string;
  roomId: string;
}

export interface TypingState {
  roomId: string;
  userId: string;
  until: string;
}

export interface FanPulseSnapshot {
  users: UserProfile[];
  posts: Post[];
  comments: Comment[];
  rooms: ChatRoom[];
  messages: Message[];
  connections: Connection[];
  notifications: NotificationItem[];
  watchParties: WatchParty[];
  predictions: Prediction[];
  liveMatch: LiveMatch;
  typing: TypingState[];
}

export interface AuthIdentity {
  id: string;
  email?: string;
  name?: string;
  avatar?: string;
}

export interface NearbyFan extends UserProfile {
  distanceKm: number;
}
