import { useState } from "react";
import { motion } from "framer-motion";
import {
  Zap,
  ShieldCheck,
  MessageSquareHeart,
  Link2Off,
  Waves,
  ShieldAlert,
  Bot,
  Power,
  Settings2,
} from "lucide-react";
import { GlassCard, NeonButton } from "../components/ui/Primitives";

interface AutoModule {
  id: string;
  title: string;
  description: string;
  icon: any;
  enabled: boolean;
  color: "purple" | "blue" | "cyan" | "pink" | "green" | "amber" | "red";
}

export function AutomationPage() {
  const [modules, setModules] = useState<AutoModule[]>([
    {
      id: "welcome",
      title: "Auto Welcome",
      description: "Greet new members with a customizable message",
      icon: MessageSquareHeart,
      enabled: true,
      color: "purple",
    },
    {
      id: "badwords",
      title: "Bad Words Filter",
      description: "Auto-delete messages containing forbidden words",
      icon: ShieldCheck,
      enabled: true,
      color: "blue",
    },
    {
      id: "antilink",
      title: "Anti Link System",
      description: "Block unauthorized URLs and invite links",
      icon: Link2Off,
      enabled: true,
      color: "cyan",
    },
    {
      id: "flood",
      title: "Flood Protection",
      description: "Detect and mute rapid message spamming",
      icon: Waves,
      enabled: false,
      color: "pink",
    },
    {
      id: "automod",
      title: "Auto Moderation",
      description: "AI-powered content moderation",
      icon: Bot,
      enabled: true,
      color: "green",
    },
    {
      id: "antiraid",
      title: "Anti Raid Mode",
      description: "Lock down groups during coordinated attacks",
      icon: ShieldAlert,
      enabled: false,
      color: "red",
    },
  ]);

  const [welcomeText, setWelcomeText] = useState(
    "👋 Welcome {user} to {group}!\n\nPlease read the pinned rules and enjoy the community!",
  );
  const [badWords, setBadWords] = useState("spam, scam, phishing, fake");
  const [blockedDomains, setBlockedDomains] = useState("t.me/joinchat, bit.ly, tinyurl");

  const toggle = (id: string) => {
    setModules((prev) => prev.map((m) => (m.id === id ? { ...m, enabled: !m.enabled } : m)));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold gradient-text">Automation Tools</h1>
          <p className="text-sm text-zinc-400 mt-1">
            Configure intelligent auto-moderation for your groups
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-zinc-400">
            {modules.filter((m) => m.enabled).length}/{modules.length} active
          </span>
          <NeonButton variant="purple">
            <span className="flex items-center gap-2">
              <Power className="w-4 h-4" />
              Apply All
            </span>
          </NeonButton>
        </div>
      </div>

      {/* Modules grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {modules.map((m, i) => (
          <motion.div
            key={m.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <GlassCard
              className={`p-5 relative overflow-hidden transition-all ${
                m.enabled ? "border-purple-500/40" : "opacity-60"
              }`}
            >
              {m.enabled && (
                <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/20 blur-3xl rounded-full -translate-y-1/2 translate-x-1/2" />
              )}
              <div className="relative">
                <div className="flex items-start justify-between mb-3">
                  <div className="p-2.5 rounded-xl bg-gradient-to-br from-purple-500/20 to-blue-500/10 border border-purple-500/25">
                    <m.icon className="w-5 h-5 text-purple-200" />
                  </div>
                  <button
                    onClick={() => toggle(m.id)}
                    className={`relative w-11 h-6 rounded-full transition ${
                      m.enabled ? "bg-gradient-to-r from-purple-500 to-blue-500" : "bg-zinc-700"
                    }`}
                  >
                    <span
                      className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-all shadow ${
                        m.enabled ? "left-5" : "left-0.5"
                      }`}
                    />
                  </button>
                </div>
                <h3 className="font-bold text-white">{m.title}</h3>
                <p className="text-xs text-zinc-400 mt-1 leading-relaxed">{m.description}</p>
                <button
                  disabled={!m.enabled}
                  className="mt-4 inline-flex items-center gap-1 text-xs text-purple-300 hover:text-purple-100 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <Settings2 className="w-3 h-3" />
                  Configure
                </button>
              </div>
            </GlassCard>
          </motion.div>
        ))}
      </div>

      {/* Configuration panels */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <GlassCard className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <MessageSquareHeart className="w-5 h-5 text-purple-300" />
            <h3 className="text-lg font-bold text-white">Welcome Message Template</h3>
          </div>
          <p className="text-xs text-zinc-400 mb-3">
            Variables: <code className="text-purple-300">{"{user}"}</code>,{" "}
            <code className="text-purple-300">{"{group}"}</code>,{" "}
            <code className="text-purple-300">{"{count}"}</code>
          </p>
          <textarea
            value={welcomeText}
            onChange={(e) => setWelcomeText(e.target.value)}
            rows={5}
            className="w-full p-3 rounded-xl bg-black/40 border border-purple-500/25 text-sm text-white font-mono resize-none"
          />
          <div className="flex gap-2 mt-3">
            <NeonButton variant="purple">Save Template</NeonButton>
            <NeonButton variant="ghost">Preview</NeonButton>
          </div>
        </GlassCard>

        <GlassCard className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <ShieldCheck className="w-5 h-5 text-blue-300" />
            <h3 className="text-lg font-bold text-white">Bad Words List</h3>
          </div>
          <p className="text-xs text-zinc-400 mb-3">
            Comma-separated list. Messages containing these will be auto-deleted.
          </p>
          <textarea
            value={badWords}
            onChange={(e) => setBadWords(e.target.value)}
            rows={3}
            className="w-full p-3 rounded-xl bg-black/40 border border-purple-500/25 text-sm text-white font-mono resize-none"
          />

          <div className="flex items-center gap-2 mt-6 mb-3">
            <Link2Off className="w-5 h-5 text-cyan-300" />
            <h3 className="text-lg font-bold text-white">Blocked Domains</h3>
          </div>
          <textarea
            value={blockedDomains}
            onChange={(e) => setBlockedDomains(e.target.value)}
            rows={3}
            className="w-full p-3 rounded-xl bg-black/40 border border-purple-500/25 text-sm text-white font-mono resize-none"
          />
          <NeonButton variant="blue" className="mt-3">Save Filters</NeonButton>
        </GlassCard>
      </div>

      {/* Live automod feed */}
      <GlassCard className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Zap className="w-5 h-5 text-amber-300" />
          <h3 className="text-lg font-bold text-white">Automation Activity Log</h3>
          <span className="ml-auto text-xs text-emerald-300 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Live
          </span>
        </div>
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {[
            { text: "Deleted message: link sharing detected in Crypto Traders", time: "10s ago", type: "antilink" },
            { text: "Warned user @spam_bot_42 for flood (5 msgs/2s)", time: "23s ago", type: "flood" },
            { text: "Sent welcome to @new_member_89 in CyberSec Hub", time: "1m ago", type: "welcome" },
            { text: "Deleted message containing blocked word in AI Builders", time: "2m ago", type: "badwords" },
            { text: "Auto-mod flagged suspicious message (92% confidence)", time: "3m ago", type: "automod" },
            { text: "Blocked 3 invite links from @spammer", time: "5m ago", type: "antilink" },
            { text: "Muted @flooder for 10 minutes (anti-flood)", time: "8m ago", type: "flood" },
            { text: "Welcome broadcast sent to 5 new members", time: "12m ago", type: "welcome" },
          ].map((log, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.04 }}
              className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-white/5 border-l-2 border-purple-500/40"
            >
              <Zap className="w-3.5 h-3.5 text-purple-300 shrink-0" />
              <p className="flex-1 text-xs text-zinc-300">{log.text}</p>
              <span className="text-[10px] text-zinc-500 shrink-0">{log.time}</span>
            </motion.div>
          ))}
        </div>
      </GlassCard>
    </div>
  );
}
