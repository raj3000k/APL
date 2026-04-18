import type {
  ChatRoom,
  Comment,
  Connection,
  FanPulseSnapshot,
  LiveMatch,
  Message,
  NotificationItem,
  Post,
  Prediction,
  UserProfile,
  WatchParty,
} from "@/utils/types";

const now = Date.now();

const users: UserProfile[] = [
  {
    id: "fan-1",
    name: "Aarav Kohli",
    avatar: "https://api.dicebear.com/9.x/fun-emoji/svg?seed=Aarav",
    team: "RCB",
    latitude: 12.9716,
    longitude: 77.5946,
    status: "Watching Match",
    fanPoints: 920,
    createdAt: new Date(now - 1000 * 60 * 60 * 24 * 80).toISOString(),
  },
  {
    id: "fan-2",
    name: "Meera Mhatre",
    avatar: "https://api.dicebear.com/9.x/fun-emoji/svg?seed=Meera",
    team: "MI",
    latitude: 12.9789,
    longitude: 77.6042,
    status: "Ready for the powerplay",
    fanPoints: 840,
    createdAt: new Date(now - 1000 * 60 * 60 * 24 * 60).toISOString(),
  },
  {
    id: "fan-3",
    name: "Ritwik Sen",
    avatar: "https://api.dicebear.com/9.x/fun-emoji/svg?seed=Ritwik",
    team: "KKR",
    latitude: 12.9622,
    longitude: 77.6121,
    status: "Watching Match",
    fanPoints: 720,
    createdAt: new Date(now - 1000 * 60 * 60 * 24 * 40).toISOString(),
  },
  {
    id: "fan-4",
    name: "Nisha Iyer",
    avatar: "https://api.dicebear.com/9.x/fun-emoji/svg?seed=Nisha",
    team: "RCB",
    latitude: 12.9611,
    longitude: 77.5849,
    status: "Watching Match",
    fanPoints: 880,
    createdAt: new Date(now - 1000 * 60 * 60 * 24 * 55).toISOString(),
  },
  {
    id: "fan-5",
    name: "Kabir Rao",
    avatar: "https://api.dicebear.com/9.x/fun-emoji/svg?seed=Kabir",
    team: "CSK",
    latitude: 13.0084,
    longitude: 77.6113,
    status: "Making chai before the death overs",
    fanPoints: 630,
    createdAt: new Date(now - 1000 * 60 * 60 * 24 * 22).toISOString(),
  },
];

const posts: Post[] = [
  {
    id: "post-1",
    userId: "fan-1",
    mediaUrl:
      "https://images.unsplash.com/photo-1543353071-873f17a7a088?auto=format&fit=crop&w=900&q=80",
    mediaType: "image",
    caption: "Chinnaswamy is absolutely buzzing tonight. The first six felt like thunder.",
    team: "RCB",
    matchTag: "RCB vs MI",
    likedBy: ["fan-2", "fan-3", "fan-4"],
    likesCount: 324,
    createdAt: new Date(now - 1000 * 60 * 18).toISOString(),
    badge: "moment",
  },
  {
    id: "post-2",
    userId: "fan-4",
    mediaUrl:
      "https://images.unsplash.com/photo-1531415074968-036ba1b575da?auto=format&fit=crop&w=900&q=80",
    mediaType: "image",
    caption: "Pulled up with the lucky jersey, the loudest whistle, and unreasonable optimism.",
    team: "RCB",
    matchTag: "Pre-match",
    likedBy: ["fan-1", "fan-5"],
    likesCount: 188,
    createdAt: new Date(now - 1000 * 60 * 42).toISOString(),
    badge: "crowd",
  },
  {
    id: "post-3",
    userId: "fan-2",
    mediaUrl:
      "https://images.unsplash.com/photo-1486286701208-1d58e9338013?auto=format&fit=crop&w=900&q=80",
    mediaType: "video",
    caption: "MI fans still backing the finish. This chase is alive.",
    team: "MI",
    matchTag: "RCB vs MI",
    likedBy: ["fan-1", "fan-3", "fan-5"],
    likesCount: 271,
    createdAt: new Date(now - 1000 * 60 * 55).toISOString(),
  },
];

const comments: Comment[] = [
  {
    id: "comment-1",
    postId: "post-1",
    userId: "fan-4",
    text: "That six was pure cinema.",
    createdAt: new Date(now - 1000 * 60 * 12).toISOString(),
  },
  {
    id: "comment-2",
    postId: "post-1",
    userId: "fan-2",
    text: "Still plenty left in the chase though.",
    createdAt: new Date(now - 1000 * 60 * 8).toISOString(),
  },
  {
    id: "comment-3",
    postId: "post-2",
    userId: "fan-1",
    text: "Never doubt the lucky jersey.",
    createdAt: new Date(now - 1000 * 60 * 20).toISOString(),
  },
];

const rooms: ChatRoom[] = [
  {
    id: "room-match",
    name: "Match Room",
    type: "match",
    participantIds: users.map((user) => user.id),
    matchLabel: "RCB vs MI",
  },
  {
    id: "room-rcb",
    name: "RCB Loyalists",
    type: "team",
    team: "RCB",
    participantIds: ["fan-1", "fan-4"],
  },
  {
    id: "room-six",
    name: "SIX Reaction Room",
    type: "emotion",
    emotion: "SIX",
    participantIds: ["fan-1", "fan-3", "fan-5"],
  },
];

const messages: Message[] = [
  {
    id: "message-1",
    roomId: "room-match",
    userId: "fan-1",
    text: "That powerplay tempo is unreal.",
    createdAt: new Date(now - 1000 * 60 * 7).toISOString(),
  },
  {
    id: "message-2",
    roomId: "room-match",
    userId: "fan-2",
    text: "MI still finishes these. Deep breaths.",
    createdAt: new Date(now - 1000 * 60 * 6).toISOString(),
  },
  {
    id: "message-3",
    roomId: "room-rcb",
    userId: "fan-4",
    text: "Ee Sala feels very real tonight.",
    createdAt: new Date(now - 1000 * 60 * 5).toISOString(),
  },
  {
    id: "message-4",
    roomId: "room-six",
    userId: "fan-5",
    text: "The bat sound alone deserved its own room.",
    createdAt: new Date(now - 1000 * 60 * 2).toISOString(),
  },
];

const connections: Connection[] = [
  {
    id: "connection-1",
    senderId: "fan-4",
    receiverId: "fan-1",
    status: "accepted",
    createdAt: new Date(now - 1000 * 60 * 60 * 10).toISOString(),
  },
  {
    id: "connection-2",
    senderId: "fan-3",
    receiverId: "fan-1",
    status: "pending",
    createdAt: new Date(now - 1000 * 60 * 15).toISOString(),
  },
];

const notifications: NotificationItem[] = [
  {
    id: "notification-1",
    userId: "fan-1",
    title: "Crowd favorite spike",
    body: "Your pre-match post is trending in the RCB circle.",
    type: "like",
    createdAt: new Date(now - 1000 * 60 * 11).toISOString(),
    read: false,
  },
  {
    id: "notification-2",
    userId: "fan-1",
    title: "Nearby fan detected",
    body: "Nisha Iyer is 1.4 km away and watching tonight.",
    type: "nearby",
    createdAt: new Date(now - 1000 * 60 * 23).toISOString(),
    read: false,
  },
];

const watchParties: WatchParty[] = [
  {
    id: "party-1",
    hostId: "fan-4",
    title: "Death Overs Rooftop Watch",
    roomId: "room-party-1",
    participantIds: ["fan-4", "fan-1"],
    invitedIds: ["fan-3"],
    createdAt: new Date(now - 1000 * 60 * 30).toISOString(),
  },
];

const predictions: Prediction[] = [
  {
    id: "prediction-1",
    userId: "fan-1",
    prediction: "6",
    createdAt: new Date(now - 1000 * 60 * 3).toISOString(),
  },
];

const liveMatch: LiveMatch = {
  id: "match-1",
  homeTeam: "RCB",
  awayTeam: "MI",
  isLive: true,
  startedAt: new Date(now - 1000 * 60 * 70).toISOString(),
  matchLabel: "RCB vs MI",
  roomId: "room-match",
};

export const initialSnapshot: FanPulseSnapshot = {
  users,
  posts,
  comments,
  rooms,
  messages,
  connections,
  notifications,
  watchParties,
  predictions,
  liveMatch,
  typing: [],
};
