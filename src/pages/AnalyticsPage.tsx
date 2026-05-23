import { GlassCard } from "../components/ui/Primitives";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from "recharts";
import {
  dailyMessagesData,
  activityData,
  groupGrowthData,
  mockGroups,
} from "../data/mockData";
import { BarChart3, TrendingUp, Users, Activity } from "lucide-react";

const pieData = [
  { name: "Text", value: 62, color: "#a855f7" },
  { name: "Media", value: 18, color: "#3b82f6" },
  { name: "Links", value: 11, color: "#06b6d4" },
  { name: "Stickers", value: 9, color: "#ec4899" },
];

const moderationData = [
  { action: "Delete", count: 147 },
  { action: "Warn", count: 89 },
  { action: "Mute", count: 42 },
  { action: "Ban", count: 12 },
  { action: "Pin", count: 28 },
];

export function AnalyticsPage() {
  const daily = dailyMessagesData();
  const hourly = activityData();
  const growth = groupGrowthData();

  const topGroups = [...mockGroups]
    .sort((a, b) => b.memberCount - a.memberCount)
    .slice(0, 5);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold gradient-text">Analytics</h1>
        <p className="text-sm text-zinc-400 mt-1">
          Deep insights into your community behavior
        </p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Avg. messages/day", value: "12,847", icon: BarChart3, trend: "+8.2%" },
          { label: "Peak hour", value: "21:00", icon: TrendingUp, trend: "UTC" },
          { label: "Active groups", value: "12", icon: Users, trend: "100%" },
          { label: "Retention", value: "94.7%", icon: Activity, trend: "+2.1%" },
        ].map((k) => (
          <GlassCard key={k.label} className="p-5">
            <div className="flex items-center justify-between mb-2">
              <k.icon className="w-4 h-4 text-purple-300" />
              <span className="text-[10px] uppercase tracking-widest text-emerald-300">{k.trend}</span>
            </div>
            <p className="text-2xl font-bold text-white">{k.value}</p>
            <p className="text-xs text-zinc-400 mt-1">{k.label}</p>
          </GlassCard>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Messages chart */}
        <GlassCard className="lg:col-span-2 p-6">
          <h3 className="text-lg font-bold text-white mb-4">Daily Messages</h3>
          <div className="h-72">
            <ResponsiveContainer>
              <AreaChart data={daily}>
                <defs>
                  <linearGradient id="grad1" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#a855f7" stopOpacity={0.6} />
                    <stop offset="100%" stopColor="#a855f7" stopOpacity={0} />
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
                    fontSize: 12,
                    color: "#fff",
                  }}
                />
                <Area type="monotone" dataKey="messages" stroke="#a855f7" strokeWidth={2} fill="url(#grad1)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        {/* Pie */}
        <GlassCard className="p-6">
          <h3 className="text-lg font-bold text-white mb-4">Message Types</h3>
          <div className="h-72">
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={pieData}
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {pieData.map((e) => (
                    <Cell key={e.name} fill={e.color} stroke="rgba(0,0,0,0.4)" strokeWidth={2} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: "rgba(10,5,32,0.95)",
                    border: "1px solid rgba(168,85,247,0.4)",
                    borderRadius: 10,
                    fontSize: 12,
                    color: "#fff",
                  }}
                />
                <Legend
                  wrapperStyle={{ fontSize: 12, color: "#d4d4d8" }}
                  formatter={(v) => <span style={{ color: "#e4e4e7" }}>{v}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Hourly */}
        <GlassCard className="p-6">
          <h3 className="text-lg font-bold text-white mb-4">Hourly Activity</h3>
          <div className="h-64">
            <ResponsiveContainer>
              <LineChart data={hourly}>
                <CartesianGrid stroke="rgba(59,130,246,0.08)" strokeDasharray="3 3" />
                <XAxis dataKey="hour" stroke="#71717a" fontSize={10} interval={3} />
                <YAxis stroke="#71717a" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    background: "rgba(10,5,32,0.95)",
                    border: "1px solid rgba(59,130,246,0.4)",
                    borderRadius: 10,
                    fontSize: 12,
                    color: "#fff",
                  }}
                />
                <Line type="monotone" dataKey="messages" stroke="#3b82f6" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        {/* Moderation bar */}
        <GlassCard className="p-6">
          <h3 className="text-lg font-bold text-white mb-4">Moderation Actions (7d)</h3>
          <div className="h-64">
            <ResponsiveContainer>
              <BarChart data={moderationData}>
                <CartesianGrid stroke="rgba(6,182,212,0.08)" strokeDasharray="3 3" />
                <XAxis dataKey="action" stroke="#71717a" fontSize={11} />
                <YAxis stroke="#71717a" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    background: "rgba(10,5,32,0.95)",
                    border: "1px solid rgba(6,182,212,0.4)",
                    borderRadius: 10,
                    fontSize: 12,
                    color: "#fff",
                  }}
                />
                <Bar dataKey="count" fill="#06b6d4" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>
      </div>

      {/* Growth + top groups */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <GlassCard className="lg:col-span-2 p-6">
          <h3 className="text-lg font-bold text-white mb-4">Group Growth (30 days)</h3>
          <div className="h-64">
            <ResponsiveContainer>
              <AreaChart data={growth}>
                <defs>
                  <linearGradient id="grow" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" stopOpacity={0.5} />
                    <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="rgba(16,185,129,0.08)" strokeDasharray="3 3" />
                <XAxis dataKey="day" stroke="#71717a" fontSize={10} interval={4} />
                <YAxis stroke="#71717a" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    background: "rgba(10,5,32,0.95)",
                    border: "1px solid rgba(16,185,129,0.4)",
                    borderRadius: 10,
                    fontSize: 12,
                    color: "#fff",
                  }}
                />
                <Area type="monotone" dataKey="members" stroke="#10b981" strokeWidth={2} fill="url(#grow)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        <GlassCard className="p-6">
          <h3 className="text-lg font-bold text-white mb-4">Top Groups</h3>
          <div className="space-y-3">
            {topGroups.map((g, i) => (
              <div key={g.id} className="flex items-center gap-3">
                <span className="w-6 h-6 rounded-md bg-gradient-to-br from-purple-500/30 to-blue-500/20 border border-purple-500/30 flex items-center justify-center text-xs font-bold text-purple-200">
                  {i + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-white truncate">{g.title}</p>
                  <p className="text-[11px] text-zinc-500">{g.memberCount.toLocaleString()} members</p>
                </div>
                <div className="w-20 h-1.5 bg-black/40 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-purple-500 to-blue-500"
                    style={{ width: `${(g.memberCount / topGroups[0].memberCount) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
