import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import {
  LayoutDashboard,
  Users,
  MessageSquare,
  BarChart3,
  Settings,
  Shield,
  Bot,
  LogOut,
  Menu,
  X,
  Bell,
  Search,
  Zap,
  Radio,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { StatusDot } from "./ui/Primitives";

const navItems = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/groups", label: "Group Control", icon: Users },
  { to: "/live-chat", label: "Live Chat", icon: MessageSquare },
  { to: "/users", label: "Users", icon: Users },
  { to: "/automation", label: "Automation", icon: Zap },
  { to: "/analytics", label: "Analytics", icon: BarChart3 },
  { to: "/settings", label: "Settings", icon: Settings },
];

export function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [botOnline, setBotOnline] = useState(true);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="relative min-h-screen flex">
      {/* Sidebar */}
      <AnimatePresence>
        {(mobileOpen || true) && (
          <motion.aside
            initial={false}
            className={`fixed lg:sticky top-0 left-0 z-40 h-screen w-72 glass-strong border-r border-purple-500/20 flex flex-col transition-transform ${
              mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
            }`}
          >
            <div className="p-5 border-b border-purple-500/15 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center neon-purple">
                  <Shield className="w-5 h-5 text-white" />
                  <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-emerald-400 border-2 border-[#0a0514] animate-pulse" />
                </div>
                <div>
                  <p className="font-bold text-lg gradient-text leading-none">ShadowPanel</p>
                  <p className="text-[10px] uppercase tracking-widest text-purple-300/60 mt-1">
                    Control Center v2.4
                  </p>
                </div>
              </div>
              <button
                onClick={() => setMobileOpen(false)}
                className="lg:hidden text-purple-300 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Bot status card */}
            <div className="p-4">
              <div className="glass rounded-xl p-3 border border-purple-500/20">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Bot className="w-4 h-4 text-purple-300" />
                    <span className="text-xs uppercase tracking-widest text-purple-200">
                      Bot Status
                    </span>
                  </div>
                  <button
                    onClick={() => setBotOnline(!botOnline)}
                    className="text-[10px] text-purple-400 hover:text-purple-200"
                  >
                    toggle
                  </button>
                </div>
                <div className="flex items-center gap-2">
                  <StatusDot online={botOnline} />
                  <span className="text-sm font-medium text-white">
                    {botOnline ? "Online" : "Offline"}
                  </span>
                  <span className="ml-auto text-[11px] text-zinc-400">42ms</span>
                </div>
              </div>
            </div>

            {/* Nav */}
            <nav className="flex-1 px-3 overflow-y-auto">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    `group flex items-center gap-3 px-3 py-2.5 rounded-xl mb-1 transition-all relative ${
                      isActive
                        ? "bg-gradient-to-r from-purple-500/30 to-blue-500/10 text-white border border-purple-500/30"
                        : "text-zinc-400 hover:text-white hover:bg-white/5"
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      {isActive && (
                        <motion.div
                          layoutId="activeNav"
                          className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-gradient-to-b from-purple-400 to-blue-400 rounded-r-full"
                        />
                      )}
                      <item.icon
                        className={`w-4 h-4 ${isActive ? "text-purple-300" : ""}`}
                      />
                      <span className="text-sm font-medium">{item.label}</span>
                      {item.to === "/live-chat" && (
                        <span className="ml-auto text-[10px] px-1.5 py-0.5 rounded-md bg-red-500/30 text-red-200 border border-red-500/40">
                          LIVE
                        </span>
                      )}
                    </>
                  )}
                </NavLink>
              ))}
            </nav>

            {/* User card */}
            <div className="p-4 border-t border-purple-500/15">
              <div className="glass rounded-xl p-3 flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-sm">
                  {(user?.username || "A")[0].toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">
                    {user?.username || "admin"}
                  </p>
                  <p className="text-[10px] uppercase tracking-widest text-purple-300/70">
                    {user?.role || "superadmin"}
                  </p>
                </div>
                <button
                  onClick={handleLogout}
                  className="p-2 rounded-lg text-zinc-400 hover:text-red-400 hover:bg-red-500/10 transition"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main */}
      <div className="flex-1 min-w-0 relative z-10">
        {/* Top bar */}
        <header className="sticky top-0 z-30 glass-strong border-b border-purple-500/15 backdrop-blur-xl">
          <div className="flex items-center gap-3 px-4 sm:px-6 h-16">
            <button
              onClick={() => setMobileOpen(true)}
              className="lg:hidden p-2 text-purple-300 hover:text-white"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="flex-1 relative max-w-md hidden sm:block">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-purple-400" />
              <input
                type="text"
                placeholder="Search groups, users, messages..."
                className="w-full pl-9 pr-4 py-2 rounded-xl bg-black/40 border border-purple-500/20 text-sm text-white placeholder-zinc-500 focus:border-purple-400/50"
              />
            </div>

            <div className="flex-1 sm:hidden" />

            <div className="flex items-center gap-2">
              <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs">
                <Radio className="w-3 h-3" />
                <span>Real-time</span>
              </div>
              <button className="relative p-2.5 rounded-xl bg-white/5 hover:bg-purple-500/20 border border-purple-500/20 text-purple-200">
                <Bell className="w-4 h-4" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-pink-500 shadow-[0_0_8px_#ec4899]" />
              </button>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-4 sm:p-6 lg:p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
