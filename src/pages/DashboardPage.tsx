import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Users,
  MessageSquare,
  Shield,
  Activity,
  TrendingUp,
  Zap,
  Bot,
  AlertTriangle,
  CheckCircle2,
  Ban,
  Pin,
  Trash2,
} from "lucide-react";
import { GlassCard, StatCard, Avatar, Badge, StatusDot } from "../components/ui/Primitives";
import {
  botStats,
  mockGroups,
  recentActivities,
  dailyMessagesData,
  mockModLogs,
  mockMessages,
} from "../data/mockData";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

export function DashboardPage() {
  const [liveStats, setLiveStats] = useState(botStats);
  const chartData = dailyMessagesData();

  // Simulate live updates
  useEffect(() => {
    const id = setInterval(() => {
      setLiveStats((s) => ({
        ...s,
        totalMessages: s.totalMessages + Math.floor(Math.random() * 20),
        activeUsers: s.activeUsers + Math.floor(Math.random() * 10) - 5,
        commandsToday: s.commandsToday + (Math.random() > 0.7 ? 1 : 0),
      }));
    }, 3000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold gradient-text">Command Center</h1>
          <p className="text-sm text-zinc-400 mt-1">
            Real-time overview of your Telegram bot operations
          </p>
        </div>
        <div className="flex items-center gap-2 px-3 py-2 rounded-xl glass">
          <StatusDot online />
          <span className="text-sm text-emerald-300">All systems operational</span>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Groups"
          value={liveStats.totalGroups}
          icon={<Users className="w-5 h-5" />}
          trend="+2 this week"
          color="purple"
        />
        <StatCard
          label="Total Members"
          value={liveStats.totalMembers.toLocaleString()}
          icon={<Users className="w-5 h-5" />}
          trend="+1.2% today"
          color="blue"
        />
        <StatCard
          label="Active Users"
          value={liveStats.activeUsers.toLocaleString()}
          icon={<Activity className="w-5 h-5" />}
          trend="+4.7%"
          color="cyan"
        />
        <StatCard
          label="Total Messages"
          value={liveStats.totalMessages.toLocaleString()}
          icon={<MessageSquare className="w-5 h-5" />}
          trend="+12.3% today"
          color="pink"
        />
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart */}
        <GlassCard className="lg:col-span-2 p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-purple-300" />
                Message Activity
              </h3>
              <p className="text-xs text-zinc-400 mt-0.5">Last 7 days</p>
            </div>
            <div className="flex gap-2 text-xs">
              <span className="px-2 py-1 rounded-md bg-purple-500/20 text-purple-200 border border-purple-500/30">
                Messages
              </span>
              <span className="px-2 py-1 rounded-md bg-blue-500/20 text-blue-200 border border-blue-500/30">
                Users
              </span>
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="purple" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#a855f7" stopOpacity={0.6} />
                    <stop offset="100%" stopColor="#a855f7" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="blue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.5} />
                    <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="rgba(168,85,247,0.08)" strokeDasharray="3 3" />
                <XAxis dataKey="day" stroke="#71717a" fontSize={11} />
                <YAxis stroke="#71717a" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    background: "rgba(10,5,32,0.95)",
                    border: "1px solid rgba(168,85,247,0.4)",
                    borderRadius: 10,
                    color: "#fff",
                    fontSize: 12,
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="messages"
                  stroke="#a855f7"
                  strokeWidth={2}
                  fill="url(#purple)"
                />
                <Area
                  type="monotone"
                  dataKey="users"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  fill="url(#blue)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        {/* Recent activity */}
        <GlassCard className="p-6">
          <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-4">
            <Zap className="w-4 h-4 text-amber-300" />
            Recent Activity
          </h3>
          <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
            {recentActivities.map((a, i) => (
              <motion.div
                key={a.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="flex items-start gap-3 p-2 rounded-lg hover:bg-white/5"
              >
                <span
                  className="w-2 h-2 rounded-full mt-1.5 shrink-0"
                  style={{ background: a.color, boxShadow: `0 0 8px ${a.color}` }}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-zinc-300 leading-snug">{a.text}</p>
                  <p className="text-[10px] text-zinc-500 mt-0.5">{a.time}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </GlassCard>
      </div>

      {/* Second row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top groups */}
        <GlassCard className="lg:col-span-2 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Bot className="w-4 h-4 text-purple-300" />
              Top Groups
            </h3>
            <button className="text-xs text-purple-300 hover:text-purple-100">View all →</button>
          </div>
          <div className="space-y-2">
            {mockGroups.slice(0, 5).map((g) => (
              <div
                key={g.id}
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition group"
              >
                <Avatar name={g.title} size={42} status="online" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">{g.title}</p>
                  <p className="text-xs text-zinc-400 truncate">@{g.username} · {g.onlineCount} online</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-sm font-semibold text-purple-200">
                    {g.memberCount.toLocaleString()}
                  </p>
                  <p className="text-[10px] text-zinc-500">members</p>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>

        {/* Moderation summary */}
        <GlassCard className="p-6">
          <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-4">
            <Shield className="w-4 h-4 text-emerald-300" />
            Moderation (24h)
          </h3>
          <div className="space-y-3">
            {[
              { label: "Messages deleted", count: 147, icon: Trash2, color: "text-red-400" },
              { label: "Users banned", count: 8, icon: Ban, color: "text-red-400" },
              { label: "Users warned", count: 23, icon: AlertTriangle, color: "text-amber-400" },
              { label: "Messages pinned", count: 12, icon: Pin, color: "text-blue-400" },
              { label: "Auto-approved", count: 89, icon: CheckCircle2, color: "text-emerald-400" },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <item.icon className={`w-4 h-4 ${item.color}`} />
                  <span className="text-xs text-zinc-300">{item.label}</span>
                </div>
                <span className="text-sm font-bold text-white">{item.count}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-purple-500/15">
            <div className="flex items-center justify-between text-xs">
              <span className="text-zinc-400">Spam blocked today</span>
              <span className="text-emerald-300 font-semibold">
                {liveStats.blockedSpam.toLocaleString()}
              </span>
            </div>
          </div>
        </GlassCard>
      </div>

      {/* Recent mod logs */}
      <GlassCard className="p-6">
        <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-4">
          <Activity className="w-4 h-4 text-cyan-300" />
          Recent Moderation Logs
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs uppercase tracking-wider text-zinc-500 border-b border-purple-500/15">
                <th className="text-left py-3 px-2">Action</th>
                <th className="text-left py-3 px-2">Target</th>
                <th className="text-left py-3 px-2 hidden sm:table-cell">Reason</th>
                <th className="text-left py-3 px-2">Time</th>
              </tr>
            </thead>
            <tbody>
              {mockModLogs.slice(0, 6).map((log) => (
                <tr key={log.id} className="border-b border-purple-500/5 hover:bg-white/5">
                  <td className="py-3 px-2">
                    <Badge
                      color={
                        log.action === "ban"
                          ? "red"
                          : log.action === "warn"
                            ? "amber"
                            : log.action === "mute"
                              ? "purple"
                              : "blue"
                      }
                    >
                      {log.action}
                    </Badge>
                  </td>
                  <td className="py-3 px-2 text-zinc-200">@{log.target}</td>
                  <td className="py-3 px-2 text-zinc-400 hidden sm:table-cell">{log.reason}</td>
                  <td className="py-3 px-2 text-zinc-500 text-xs">
                    {new Date(log.timestamp).toLocaleTimeString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>

      {/* Live messages stream */}
      <GlassCard className="p-6">
        <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-4">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          Live Telegram Stream
        </h3>
        <div className="space-y-2 max-h-72 overflow-y-auto pr-2">
          {mockMessages.slice(-10).reverse().map((m) => (
            <div key={m.id} className="flex gap-3 p-2 rounded-lg hover:bg-white/5">
              <Avatar name={m.from.firstName + " " + (m.from.lastName || "")} size={36} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 text-xs">
                  <span className="font-medium text-purple-200">
                    @{m.from.username}
                  </span>
                  <span className="text-zinc-500">in {m.chatTitle}</span>
                  <span className="ml-auto text-zinc-500 text-[10px]">
                    {new Date(m.timestamp).toLocaleTimeString()}
                  </span>
                </div>
                <p className="text-sm text-zinc-300 mt-0.5 truncate">{m.text}</p>
              </div>
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  );
}
