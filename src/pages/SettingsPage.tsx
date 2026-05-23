import { useState } from "react";
import {
  Palette,
  Shield,
  Bot,
  Download,
  Key,
  Bell,
  Zap,
  Save,
  RefreshCw,
  Eye,
  EyeOff,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";
import { GlassCard, NeonButton } from "../components/ui/Primitives";

export function SettingsPage() {
  const [theme, setTheme] = useState<"cyberpunk" | "midnight" | "neon">("cyberpunk");
  const [botToken, setBotToken] = useState("••••••••••••••••••••••••••••••");
  const [showToken, setShowToken] = useState(false);
  const [apiKey, setApiKey] = useState("29765104");
  const [apiHash, setApiHash] = useState("•••••••••••••••••••••••••");
  const [notifications, setNotifications] = useState({
    mentions: true,
    joins: true,
    leaves: false,
    moderation: true,
    raid: true,
  });
  const [modules, setModules] = useState({
    antiSpam: true,
    autoMod: true,
    welcome: true,
    analytics: true,
    logs: true,
  });
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const toggleNotif = (k: keyof typeof notifications) =>
    setNotifications((p) => ({ ...p, [k]: !p[k] }));

  const toggleModule = (k: keyof typeof modules) =>
    setModules((p) => ({ ...p, [k]: !p[k] }));

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold gradient-text">Settings</h1>
          <p className="text-sm text-zinc-400 mt-1">Configure your ShadowPanel instance</p>
        </div>
        <div className="flex items-center gap-2">
          {saved && (
            <span className="text-xs text-emerald-300 flex items-center gap-1 animate-pulse">
              <CheckCircle2 className="w-3 h-3" />
              Saved
            </span>
          )}
          <NeonButton variant="ghost">
            <RefreshCw className="w-4 h-4" />
          </NeonButton>
          <NeonButton variant="purple" onClick={handleSave}>
            <span className="flex items-center gap-2">
              <Save className="w-4 h-4" />
              Save Changes
            </span>
          </NeonButton>
        </div>
      </div>

      {/* Security warning */}
      <GlassCard className="p-5 border-amber-500/30 bg-amber-500/5">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-amber-200">Security Notice</p>
            <p className="text-xs text-amber-100/80 mt-1 leading-relaxed">
              Never share your bot token or API credentials. In production, these are stored in
              server-side environment variables (<code>.env</code>) and never exposed to the
              browser.
            </p>
          </div>
        </div>
      </GlassCard>

      {/* Bot configuration */}
      <GlassCard className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Bot className="w-5 h-5 text-purple-300" />
          <h3 className="text-lg font-bold text-white">Telegram Bot Configuration</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs uppercase tracking-widest text-zinc-400 mb-1 block">
              Bot Token
            </label>
            <div className="relative">
              <Key className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-purple-400" />
              <input
                type={showToken ? "text" : "password"}
                value={botToken}
                onChange={(e) => setBotToken(e.target.value)}
                placeholder="123456:ABC-DEF..."
                className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-black/40 border border-purple-500/25 text-sm text-white font-mono"
              />
              <button
                onClick={() => setShowToken(!showToken)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-purple-400 hover:text-white"
              >
                {showToken ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
          <div>
            <label className="text-xs uppercase tracking-widest text-zinc-400 mb-1 block">
              API ID
            </label>
            <input
              type="text"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-purple-500/25 text-sm text-white font-mono"
            />
          </div>
          <div className="md:col-span-2">
            <label className="text-xs uppercase tracking-widest text-zinc-400 mb-1 block">
              API Hash
            </label>
            <input
              type="password"
              value={apiHash}
              onChange={(e) => setApiHash(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-purple-500/25 text-sm text-white font-mono"
            />
          </div>
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          <NeonButton variant="purple">Verify Connection</NeonButton>
          <NeonButton variant="ghost">Reconnect Bot</NeonButton>
          <NeonButton variant="blue">Fetch Bot Info</NeonButton>
        </div>
      </GlassCard>

      {/* Theme */}
      <GlassCard className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Palette className="w-5 h-5 text-pink-300" />
          <h3 className="text-lg font-bold text-white">Theme Customization</h3>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {[
            { id: "cyberpunk", name: "Cyberpunk", from: "from-purple-600", to: "to-pink-600" },
            { id: "midnight", name: "Midnight", from: "from-blue-600", to: "to-indigo-700" },
            { id: "neon", name: "Neon", from: "from-cyan-500", to: "to-emerald-500" },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setTheme(t.id as any)}
              className={`relative overflow-hidden rounded-xl p-4 border transition ${
                theme === t.id
                  ? "border-purple-400 neon-purple"
                  : "border-purple-500/20 hover:border-purple-500/40"
              }`}
            >
              <div className={`h-12 rounded-lg bg-gradient-to-br ${t.from} ${t.to} mb-2`} />
              <p className="text-sm text-white font-medium">{t.name}</p>
              {theme === t.id && (
                <span className="absolute top-2 right-2 text-[10px] px-2 py-0.5 rounded-full bg-purple-500 text-white">
                  Active
                </span>
              )}
            </button>
          ))}
        </div>
      </GlassCard>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Notifications */}
        <GlassCard className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Bell className="w-5 h-5 text-blue-300" />
            <h3 className="text-lg font-bold text-white">Notifications</h3>
          </div>
          <div className="space-y-3">
            {Object.entries(notifications).map(([k, v]) => (
              <div key={k} className="flex items-center justify-between p-3 rounded-xl bg-black/30 border border-purple-500/10">
                <div>
                  <p className="text-sm text-white capitalize">
                    {k === "joins" ? "User joins" : k === "leaves" ? "User leaves" : k === "raid" ? "Raid alerts" : `${k} alerts`}
                  </p>
                  <p className="text-xs text-zinc-500">
                    Push notification to browser
                  </p>
                </div>
                <button
                  onClick={() => toggleNotif(k as keyof typeof notifications)}
                  className={`relative w-11 h-6 rounded-full transition ${
                    v ? "bg-gradient-to-r from-purple-500 to-blue-500" : "bg-zinc-700"
                  }`}
                >
                  <span
                    className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-all shadow ${
                      v ? "left-5" : "left-0.5"
                    }`}
                  />
                </button>
              </div>
            ))}
          </div>
          <NeonButton variant="blue" className="mt-4 w-full">
            <span className="flex items-center gap-2 justify-center">
              <Bell className="w-4 h-4" />
              Request Browser Permission
            </span>
          </NeonButton>
        </GlassCard>

        {/* Module toggles */}
        <GlassCard className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Zap className="w-5 h-5 text-amber-300" />
            <h3 className="text-lg font-bold text-white">Module Toggles</h3>
          </div>
          <div className="space-y-3">
            {Object.entries(modules).map(([k, v]) => (
              <div key={k} className="flex items-center justify-between p-3 rounded-xl bg-black/30 border border-purple-500/10">
                <div>
                  <p className="text-sm text-white capitalize">
                    {k.replace(/([A-Z])/g, " $1")}
                  </p>
                  <p className="text-xs text-zinc-500">
                    {v ? "Enabled" : "Disabled"}
                  </p>
                </div>
                <button
                  onClick={() => toggleModule(k as keyof typeof modules)}
                  className={`relative w-11 h-6 rounded-full transition ${
                    v ? "bg-gradient-to-r from-emerald-500 to-teal-500" : "bg-zinc-700"
                  }`}
                >
                  <span
                    className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-all shadow ${
                      v ? "left-5" : "left-0.5"
                    }`}
                  />
                </button>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>

      {/* Security */}
      <GlassCard className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Shield className="w-5 h-5 text-emerald-300" />
          <h3 className="text-lg font-bold text-white">Security</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs uppercase tracking-widest text-zinc-400 mb-1 block">
              Current Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-purple-500/25 text-sm text-white"
            />
          </div>
          <div>
            <label className="text-xs uppercase tracking-widest text-zinc-400 mb-1 block">
              New Password
            </label>
            <input
              type="password"
              placeholder="Enter new password"
              className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-purple-500/25 text-sm text-white"
            />
          </div>
        </div>
        <div className="flex flex-wrap gap-2 mt-4">
          <NeonButton variant="purple">Update Password</NeonButton>
          <NeonButton variant="ghost">Enable 2FA</NeonButton>
          <NeonButton variant="ghost">Active Sessions</NeonButton>
        </div>
      </GlassCard>

      {/* Export / Data */}
      <GlassCard className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Download className="w-5 h-5 text-cyan-300" />
          <h3 className="text-lg font-bold text-white">Data & Export</h3>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {["Export logs", "Export users", "Export stats", "Backup config"].map((t) => (
            <button
              key={t}
              className="p-4 rounded-xl bg-black/30 border border-purple-500/15 hover:border-purple-400/40 hover:bg-purple-500/10 transition text-center"
            >
              <Download className="w-4 h-4 mx-auto text-purple-300 mb-2" />
              <p className="text-xs text-zinc-200">{t}</p>
            </button>
          ))}
        </div>
      </GlassCard>

      {/* Install guide */}
      <GlassCard className="p-6">
        <h3 className="text-lg font-bold text-white mb-4">📘 Installation Guide</h3>
        <div className="space-y-4 text-sm text-zinc-300">
          <div>
            <p className="font-semibold text-purple-200 mb-1">1. Clone & install</p>
            <pre className="bg-black/60 rounded-lg p-3 text-xs font-mono text-cyan-200 overflow-x-auto">
{`git clone https://github.com/your/shadowpanel.git
cd shadowpanel
npm install`}
            </pre>
          </div>
          <div>
            <p className="font-semibold text-purple-200 mb-1">2. Set environment variables</p>
            <pre className="bg-black/60 rounded-lg p-3 text-xs font-mono text-cyan-200 overflow-x-auto">
{`# .env
VITE_API_URL=https://api.your-domain.com
VITE_BOT_TOKEN=your_bot_token_here
VITE_API_ID=your_api_id
VITE_API_HASH=your_api_hash
JWT_SECRET=your_jwt_secret
MONGO_URI=mongodb://localhost:27017/shadowpanel`}
            </pre>
          </div>
          <div>
            <p className="font-semibold text-purple-200 mb-1">3. Start backend + frontend</p>
            <pre className="bg-black/60 rounded-lg p-3 text-xs font-mono text-cyan-200 overflow-x-auto">
{`# Terminal 1 — backend
cd server && npm run dev

# Terminal 2 — frontend
npm run dev`}
            </pre>
          </div>
          <div>
            <p className="font-semibold text-purple-200 mb-1">4. Build for production</p>
            <pre className="bg-black/60 rounded-lg p-3 text-xs font-mono text-cyan-200 overflow-x-auto">
{`npm run build
# dist/ folder ready to deploy`}
            </pre>
          </div>
        </div>
      </GlassCard>

      <p className="text-center text-xs text-zinc-500 pb-6">
        ShadowPanel v2.4.1 · Built with React, Vite, Tailwind · © 2026
      </p>
    </div>
  );
}
