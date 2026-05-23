import { useState } from "react";
import { motion } from "framer-motion";
import {
  Users,
  Search,
  Settings2,
  Send,
  Pin,
  Ban,
  VolumeX,
  Clock,
  ShieldAlert,
  MessageSquare,
} from "lucide-react";
import { Avatar, Badge, GlassCard, NeonButton } from "../components/ui/Primitives";
import { mockGroups } from "../data/mockData";

export function GroupsPage() {
  const [selected, setSelected] = useState(mockGroups[0]);
  const [search, setSearch] = useState("");
  const [message, setMessage] = useState("");
  const [slowmode, setSlowmode] = useState(selected.slowmode);

  const filtered = mockGroups.filter((g) =>
    g.title.toLowerCase().includes(search.toLowerCase()),
  );

  const actionButtons = [
    { label: "Broadcast", icon: Send, color: "blue" as const },
    { label: "Pin Notice", icon: Pin, color: "purple" as const },
    { label: "Slowmode", icon: Clock, color: "purple" as const, variant: "ghost" as const },
    { label: "Mute All", icon: VolumeX, color: "purple" as const, variant: "ghost" as const },
    { label: "Anti Raid", icon: ShieldAlert, color: "purple" as const, variant: "danger" as const },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold gradient-text">Group Control</h1>
          <p className="text-sm text-zinc-400 mt-1">
            Manage {mockGroups.length} groups where your bot has admin rights
          </p>
        </div>
        <NeonButton variant="purple">
          <span className="flex items-center gap-2">
            <Settings2 className="w-4 h-4" />
            Bot Permissions
          </span>
        </NeonButton>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Group list */}
        <GlassCard className="p-5 lg:col-span-1">
          <div className="relative mb-4">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-purple-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search groups..."
              className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-black/40 border border-purple-500/25 text-sm text-white placeholder-zinc-500"
            />
          </div>
          <div className="space-y-1 max-h-[600px] overflow-y-auto pr-1">
            {filtered.map((g) => {
              const active = selected.id === g.id;
              return (
                <button
                  key={g.id}
                  onClick={() => {
                    setSelected(g);
                    setSlowmode(g.slowmode);
                  }}
                  className={`w-full flex items-center gap-3 p-3 rounded-xl transition text-left ${
                    active
                      ? "bg-gradient-to-r from-purple-500/25 to-blue-500/10 border border-purple-500/30"
                      : "hover:bg-white/5"
                  }`}
                >
                  <Avatar name={g.title} size={42} status={active ? "online" : "recently"} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">{g.title}</p>
                    <p className="text-xs text-zinc-400 truncate flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      {g.memberCount.toLocaleString()}
                    </p>
                  </div>
                  {g.muted && (
                    <VolumeX className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  )}
                </button>
              );
            })}
          </div>
        </GlassCard>

        {/* Selected group */}
        <div className="lg:col-span-2 space-y-4">
          <motion.div
            key={selected.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-strong rounded-2xl p-6 border border-purple-500/25"
          >
            <div className="flex items-start gap-4">
              <Avatar name={selected.title} size={64} status="online" />
              <div className="flex-1 min-w-0">
                <h2 className="text-xl font-bold text-white">{selected.title}</h2>
                <p className="text-sm text-purple-300">@{selected.username}</p>
                <p className="text-xs text-zinc-400 mt-2 line-clamp-2">{selected.description}</p>
                <div className="flex flex-wrap gap-2 mt-3">
                  <Badge color="purple">
                    <Users className="w-3 h-3" />
                    {selected.memberCount.toLocaleString()}
                  </Badge>
                  <Badge color="green">{selected.onlineCount} online</Badge>
                  {selected.muted && <Badge color="amber">Muted</Badge>}
                  {selected.slowmode > 0 && (
                    <Badge color="blue">
                      <Clock className="w-3 h-3" />
                      {selected.slowmode}s slowmode
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Quick actions */}
          <GlassCard className="p-5">
            <h3 className="text-sm font-semibold text-zinc-300 uppercase tracking-wider mb-3">
              Quick Actions
            </h3>
            <div className="flex flex-wrap gap-2">
              {actionButtons.map((a) => (
                <NeonButton
                  key={a.label}
                  variant={a.variant || a.color}
                  onClick={() =>
                    alert(`Action "${a.label}" triggered on ${selected.title}\n\n(In production: calls your backend API)`)
                  }
                >
                  <span className="flex items-center gap-2">
                    <a.icon className="w-4 h-4" />
                    {a.label}
                  </span>
                </NeonButton>
              ))}
            </div>
          </GlassCard>

          {/* Send message */}
          <GlassCard className="p-5">
            <h3 className="text-sm font-semibold text-zinc-300 uppercase tracking-wider mb-3 flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-purple-300" />
              Send Broadcast to Group
            </h3>
            <div className="flex gap-2">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type a message to send as the bot..."
                className="flex-1 px-4 py-2.5 rounded-xl bg-black/40 border border-purple-500/25 text-sm text-white placeholder-zinc-500"
              />
              <NeonButton variant="purple" onClick={() => {
                if (message.trim()) {
                  alert(`Broadcasting to ${selected.title}:\n\n${message}`);
                  setMessage("");
                }
              }}>
                <Send className="w-4 h-4" />
              </NeonButton>
            </div>
          </GlassCard>

          {/* Slowmode + moderation */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <GlassCard className="p-5">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-zinc-300 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-blue-300" />
                  Slowmode
                </h3>
                <span className="text-sm font-bold text-white">{slowmode}s</span>
              </div>
              <input
                type="range"
                min="0"
                max="60"
                value={slowmode}
                onChange={(e) => setSlowmode(Number(e.target.value))}
                className="w-full accent-purple-500"
              />
              <p className="text-xs text-zinc-500 mt-2">
                {slowmode === 0
                  ? "Slowmode disabled — members can send messages freely"
                  : `Members can send one message every ${slowmode} seconds`}
              </p>
            </GlassCard>

            <GlassCard className="p-5">
              <h3 className="text-sm font-semibold text-zinc-300 flex items-center gap-2 mb-3">
                <ShieldAlert className="w-4 h-4 text-red-300" />
                Danger Zone
              </h3>
              <div className="space-y-2">
                <button className="w-full flex items-center justify-between p-3 rounded-xl bg-red-500/10 border border-red-500/25 text-red-200 hover:bg-red-500/20 transition text-sm">
                  <span className="flex items-center gap-2">
                    <Ban className="w-4 h-4" />
                    Lock Group
                  </span>
                  <span className="text-xs opacity-70">Admins only</span>
                </button>
                <button className="w-full flex items-center justify-between p-3 rounded-xl bg-amber-500/10 border border-amber-500/25 text-amber-200 hover:bg-amber-500/20 transition text-sm">
                  <span className="flex items-center gap-2">
                    <VolumeX className="w-4 h-4" />
                    Mute Everyone
                  </span>
                  <span className="text-xs opacity-70">1 hour</span>
                </button>
              </div>
            </GlassCard>
          </div>
        </div>
      </div>
    </div>
  );
}
