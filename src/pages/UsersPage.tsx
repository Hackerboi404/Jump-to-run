import { useState } from "react";
import { Search, Shield, AlertTriangle, Ban, MessageSquare, Crown, Star } from "lucide-react";
import { Avatar, Badge, GlassCard, NeonButton } from "../components/ui/Primitives";
import { mockUsers } from "../data/mockData";

export function UsersPage() {
  const [selected, setSelected] = useState(mockUsers[0]);
  const [search, setSearch] = useState("");

  const filtered = mockUsers.filter(
    (u) =>
      u.firstName.toLowerCase().includes(search.toLowerCase()) ||
      u.username.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold gradient-text">User Management</h1>
        <p className="text-sm text-zinc-400 mt-1">
          Track, moderate, and analyze your community members
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* User list */}
        <GlassCard className="lg:col-span-1 p-5 max-h-[700px] flex flex-col">
          <div className="relative mb-3">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-purple-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search users..."
              className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-black/40 border border-purple-500/25 text-sm text-white placeholder-zinc-500"
            />
          </div>
          <div className="flex-1 overflow-y-auto space-y-1 pr-1">
            {filtered.slice(0, 30).map((u) => {
              const active = selected.id === u.id;
              return (
                <button
                  key={u.id}
                  onClick={() => setSelected(u)}
                  className={`w-full flex items-center gap-3 p-2.5 rounded-xl transition text-left ${
                    active ? "bg-gradient-to-r from-purple-500/30 to-blue-500/10 border border-purple-500/30" : "hover:bg-white/5"
                  }`}
                >
                  <Avatar
                    name={`${u.firstName} ${u.lastName || ""}`}
                    size={38}
                    status={u.status === "online" ? "online" : u.status === "recently" ? "recently" : "offline"}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate flex items-center gap-1">
                      {u.firstName}
                      {u.isPremium && <Star className="w-3 h-3 text-amber-400 fill-amber-400" />}
                    </p>
                    <p className="text-xs text-zinc-400 truncate">@{u.username}</p>
                  </div>
                  {u.warns > 0 && (
                    <Badge color={u.warns >= 3 ? "red" : "amber"}>
                      <AlertTriangle className="w-3 h-3" />
                      {u.warns}
                    </Badge>
                  )}
                </button>
              );
            })}
          </div>
        </GlassCard>

        {/* User details */}
        <div className="lg:col-span-2 space-y-4">
          <GlassCard className="p-6 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-blue-500/10" />
            <div className="relative flex items-start gap-5">
              <Avatar
                name={`${selected.firstName} ${selected.lastName || ""}`}
                size={96}
                status={selected.status === "online" ? "online" : selected.status === "recently" ? "recently" : "offline"}
              />
              <div className="flex-1 min-w-0">
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                  {selected.firstName} {selected.lastName}
                  {selected.isPremium && (
                    <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-200 border border-amber-500/30">
                      <Crown className="w-3 h-3" />
                      Premium
                    </span>
                  )}
                </h2>
                <p className="text-purple-300">@{selected.username}</p>
                <p className="text-xs text-zinc-400 mt-2">
                  ID: <code className="text-zinc-300">{selected.id}</code>
                </p>
                <div className="flex flex-wrap gap-2 mt-3">
                  <Badge color={selected.status === "online" ? "green" : selected.status === "recently" ? "amber" : "gray"}>
                    {selected.status}
                  </Badge>
                  <Badge color="purple">
                    <MessageSquare className="w-3 h-3" />
                    {selected.messageCount} msgs
                  </Badge>
                  <Badge color={selected.warns === 0 ? "green" : selected.warns >= 3 ? "red" : "amber"}>
                    {selected.warns} warns
                  </Badge>
                </div>
              </div>
            </div>

            <div className="relative grid grid-cols-3 gap-3 mt-6 pt-6 border-t border-purple-500/15">
              <div>
                <p className="text-[10px] uppercase tracking-widest text-zinc-500">Joined</p>
                <p className="text-sm text-white font-semibold mt-1">
                  {new Date(selected.joinDate).toLocaleDateString()}
                </p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-widest text-zinc-500">Last Active</p>
                <p className="text-sm text-white font-semibold mt-1">
                  {selected.status === "online" ? "Now" : "2h ago"}
                </p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-widest text-zinc-500">Reputation</p>
                <p className="text-sm text-white font-semibold mt-1">
                  {selected.messageCount > 1000 ? "⭐ Trusted" : selected.messageCount > 200 ? "✓ Regular" : "New"}
                </p>
              </div>
            </div>
          </GlassCard>

          {/* Actions */}
          <GlassCard className="p-5">
            <h3 className="text-sm font-semibold text-zinc-300 uppercase tracking-wider mb-3 flex items-center gap-2">
              <Shield className="w-4 h-4 text-purple-300" />
              Moderation Actions
            </h3>
            <div className="flex flex-wrap gap-2">
              <NeonButton variant="purple">Warn User</NeonButton>
              <NeonButton variant="ghost">Mute 1h</NeonButton>
              <NeonButton variant="ghost">Mute 24h</NeonButton>
              <NeonButton variant="ghost">Unmute</NeonButton>
              <NeonButton variant="danger">
                <span className="flex items-center gap-2">
                  <Ban className="w-4 h-4" />
                  Ban
                </span>
              </NeonButton>
              <NeonButton variant="blue">Promote</NeonButton>
            </div>
          </GlassCard>

          {/* History */}
          <GlassCard className="p-5">
            <h3 className="text-sm font-semibold text-zinc-300 uppercase tracking-wider mb-3">
              Moderation History
            </h3>
            {selected.warns === 0 ? (
              <div className="text-center py-6 text-zinc-500 text-sm">
                <Shield className="w-8 h-8 mx-auto mb-2 opacity-30" />
                Clean record — no moderation actions
              </div>
            ) : (
              <div className="space-y-2">
                {Array.from({ length: selected.warns }).map((_, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 p-3 rounded-xl bg-amber-500/5 border border-amber-500/15"
                  >
                    <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-zinc-200">Warning issued</p>
                      <p className="text-xs text-zinc-500">Spam detected in message</p>
                    </div>
                    <span className="text-xs text-zinc-500">
                      {Math.floor(Math.random() * 30) + 1}d ago
                    </span>
                  </div>
                ))}
              </div>
            )}
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
