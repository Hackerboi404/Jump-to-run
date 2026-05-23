// Mock data simulating Telegram bot control center state
// In production, this would come from your Node.js/Socket.io backend

export interface TelegramUser {
  id: number;
  username: string;
  firstName: string;
  lastName?: string;
  avatar?: string;
  status: "online" | "offline" | "recently" | "banned" | "muted";
  joinDate: string;
  messageCount: number;
  warns: number;
  isPremium?: boolean;
}

export interface TelegramGroup {
  id: number;
  title: string;
  username?: string;
  memberCount: number;
  onlineCount: number;
  avatar?: string;
  description: string;
  slowmode: number;
  muted: boolean;
  lastActive: string;
}

export interface TelegramMessage {
  id: number;
  chatId: number;
  chatTitle: string;
  from: TelegramUser;
  text: string;
  timestamp: number;
  type: "text" | "photo" | "document" | "sticker" | "voice" | "system";
  pinned?: boolean;
  edited?: boolean;
  replyTo?: number;
}

export interface ModLog {
  id: number;
  action: "ban" | "mute" | "warn" | "unban" | "unmute" | "pin" | "delete" | "kick";
  target: string;
  admin: string;
  reason: string;
  timestamp: number;
  chatId: number;
}

const firstNames = ["Alex", "Maya", "Kai", "Zoe", "Nova", "Riven", "Jax", "Luna", "Orion", "Vex", "Nyx", "Ash", "Kira", "Dante", "Echo", "Sage", "Rune", "Ember", "Quinn", "Atlas"];
const lastNames = ["Storm", "Cross", "Void", "Blaze", "Frost", "Reed", "Wolf", "Vale", "Pierce", "Rook", "Kade", "Wren", "Slate", "Crow", "Vale", "Drake"];
const handles = ["cyber_ghost", "neon_pulse", "shadow_net", "void_walker", "byte_smith", "dark_flow", "pixel_ace", "flux_wave", "zero_cool", "phantom_x", "nova_dev", "glitch_99", "rune_coder", "echo_void", "pulse_404", "vex_core", "ash_byte", "kira_sys", "dante_root", "echo_null"];
const groupNames = ["CyberSec Hub", "DevOps Nexus", "Crypto Traders Elite", "AI Builders", "Shadow Network", "Neon Collective", "Quantum Coders", "Void Protocol", "Pulse Market", "Ghost Ops", "Flux Labs", "Zero Day Club"];

const colors = ["#a855f7", "#3b82f6", "#06b6d4", "#ec4899", "#f59e0b", "#10b981", "#ef4444", "#8b5cf6"];

function hashStr(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = ((h << 5) - h + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

export function avatarColor(seed: string): string {
  return colors[hashStr(seed) % colors.length];
}

export function initials(name: string): string {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

export const mockUsers: TelegramUser[] = Array.from({ length: 48 }, (_, i) => {
  const fn = firstNames[i % firstNames.length];
  const ln = lastNames[i % lastNames.length];
  const handle = handles[i % handles.length];
  const statuses: TelegramUser["status"][] = ["online", "offline", "recently", "online", "online"];
  return {
    id: 1000000 + i * 137,
    username: `${handle}_${i}`,
    firstName: fn,
    lastName: ln,
    status: statuses[i % statuses.length],
    joinDate: new Date(Date.now() - Math.floor(Math.random() * 365 * 24 * 3600 * 1000)).toISOString(),
    messageCount: Math.floor(Math.random() * 2500) + 10,
    warns: Math.floor(Math.random() * 4),
    isPremium: i % 7 === 0,
  };
});

export const mockGroups: TelegramGroup[] = Array.from({ length: 12 }, (_, i) => ({
  id: -1000000000 - i * 271,
  title: groupNames[i % groupNames.length],
  username: groupNames[i % groupNames.length].toLowerCase().replace(/\s+/g, "_"),
  memberCount: Math.floor(Math.random() * 15000) + 500,
  onlineCount: Math.floor(Math.random() * 400) + 20,
  description: "An elite community for discussing bleeding-edge technology, security, and the future of decentralized systems.",
  slowmode: i % 3 === 0 ? 10 : 0,
  muted: i === 5,
  lastActive: new Date(Date.now() - Math.floor(Math.random() * 3600 * 1000)).toISOString(),
}));

const messageTemplates = [
  "Anyone got experience with zero-knowledge proofs?",
  "Just deployed a new bot — runs 10x faster now 🔥",
  "Check out this exploit I found in the latest firmware",
  "Does anyone know a good library for Telegram bot APIs?",
  "Meeting at 8pm UTC in the voice channel",
  "Pushed new anti-spam rules. Please read the pinned message.",
  "The market is looking bullish today 📈",
  "New CVE just dropped — patch your servers ASAP",
  "Who's attending the hacker conference next month?",
  "Built a custom kernel module this weekend",
  "Reminder: don't share personal info here",
  "Loving the new dashboard update",
  "Can someone review my PR? Link in thread",
  "Happy to help anyone with Rust questions",
  "The AI just wrote my entire test suite 🤯",
  "Streaming live in 10 minutes",
  "This group is awesome, thanks for having me",
  "Updated the welcome bot, let me know if issues",
  "New raid protection is working flawlessly",
  "Anyone up for a CTF tonight?",
];

export const mockMessages: TelegramMessage[] = Array.from({ length: 60 }, (_, i) => {
  const user = mockUsers[i % mockUsers.length];
  const group = mockGroups[i % mockGroups.length];
  return {
    id: 5000 + i,
    chatId: group.id,
    chatTitle: group.title,
    from: user,
    text: messageTemplates[i % messageTemplates.length],
    timestamp: Date.now() - (60 - i) * 45000,
    type: i % 17 === 0 ? "photo" : i % 23 === 0 ? "sticker" : "text",
    pinned: i % 29 === 0,
    edited: i % 11 === 0,
  };
});

export const mockModLogs: ModLog[] = Array.from({ length: 24 }, (_, i) => {
  const actions: ModLog["action"][] = ["ban", "mute", "warn", "delete", "pin", "kick", "unban", "unmute"];
  const reasons = [
    "Spam detected",
    "Bad language",
    "Link sharing",
    "Flood protection",
    "Manual moderation",
    "Raid participation",
    "User request",
    "Appeal approved",
  ];
  return {
    id: 9000 + i,
    action: actions[i % actions.length],
    target: mockUsers[i % mockUsers.length].username,
    admin: "ShadowBot",
    reason: reasons[i % reasons.length],
    timestamp: Date.now() - (24 - i) * 1800 * 1000,
    chatId: mockGroups[i % mockGroups.length].id,
  };
});

// Chart data generators
export function dailyMessagesData() {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  return days.map((d) => ({
    day: d,
    messages: Math.floor(Math.random() * 8000) + 2000,
    users: Math.floor(Math.random() * 600) + 100,
  }));
}

export function activityData() {
  return Array.from({ length: 24 }, (_, i) => ({
    hour: `${i}:00`,
    messages: Math.floor(Math.random() * 500) + 50,
    joins: Math.floor(Math.random() * 30) + 2,
  }));
}

export function groupGrowthData() {
  let total = 2400;
  return Array.from({ length: 30 }, (_, i) => {
    total += Math.floor(Math.random() * 120) - 20;
    return { day: `Day ${i + 1}`, members: total };
  });
}

export const recentActivities = [
  { id: 1, type: "join", text: "nova_dev joined CyberSec Hub", time: "2m ago", color: "#10b981" },
  { id: 2, type: "ban", text: "spam_bot_42 was banned by ShadowBot", time: "5m ago", color: "#ef4444" },
  { id: 3, type: "pin", text: "Admin pinned a message in AI Builders", time: "12m ago", color: "#3b82f6" },
  { id: 4, type: "warn", text: "User warned for link sharing", time: "18m ago", color: "#f59e0b" },
  { id: 5, type: "mute", text: "User muted for 1 hour (flood)", time: "24m ago", color: "#a855f7" },
  { id: 6, type: "join", text: "3 new members joined DevOps Nexus", time: "31m ago", color: "#10b981" },
  { id: 7, type: "delete", text: "ShadowBot deleted 12 spam messages", time: "45m ago", color: "#ef4444" },
  { id: 8, type: "info", text: "Anti-raid mode deactivated", time: "1h ago", color: "#06b6d4" },
];

export const botStats = {
  totalGroups: 12,
  totalMembers: 47832,
  activeUsers: 3842,
  totalMessages: 1284739,
  uptime: 99.97,
  apiLatency: 42,
  commandsToday: 2847,
  blockedSpam: 1293,
};
