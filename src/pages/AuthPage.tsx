import { useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Shield, Mail, Lock, User, ArrowRight, Eye, EyeOff } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { NeonButton } from "../components/ui/Primitives";
import { ParticleBackground } from "../components/ParticleBackground";

export function AuthPage() {
  const loc = useLocation();
  const isRegister = loc.pathname === "/register";
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("admin@shadowpanel.io");
  const [password, setPassword] = useState("shadow123");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (isRegister) {
        await register(username || email.split("@")[0], email, password);
      } else {
        await login(email, password);
      }
      navigate("/dashboard");
    } catch (err: any) {
      setError(err.message || "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 overflow-hidden">
      <ParticleBackground />

      {/* Ambient glows */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[120px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-md"
      >
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <motion.div
            initial={{ rotate: -180, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            transition={{ duration: 0.8, type: "spring" }}
            className="relative"
          >
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 via-fuchsia-500 to-blue-500 flex items-center justify-center neon-purple">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <motion.span
              animate={{ scale: [1, 1.3, 1], opacity: [0.6, 0.2, 0.6] }}
              transition={{ duration: 2.5, repeat: Infinity }}
              className="absolute inset-0 rounded-2xl bg-purple-500/40 blur-xl -z-10"
            />
          </motion.div>
          <h1 className="mt-5 text-3xl font-bold gradient-text">ShadowPanel</h1>
          <p className="text-xs uppercase tracking-[0.3em] text-purple-300/60 mt-2">
            Telegram Control Center
          </p>
        </div>

        <div className="glass-strong rounded-3xl p-8 border border-purple-500/25 relative overflow-hidden">
          {/* Decorative scan line */}
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-purple-400/60 to-transparent" />

          <h2 className="text-2xl font-bold text-white mb-1">
            {isRegister ? "Create Account" : "Welcome Back"}
          </h2>
          <p className="text-sm text-zinc-400 mb-6">
            {isRegister
              ? "Join the elite control panel"
              : "Sign in to access your control center"}
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {isRegister && (
              <div className="relative">
                <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-purple-400" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Username"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-black/40 border border-purple-500/25 text-white placeholder-zinc-500 text-sm focus:border-purple-400/60"
                  required
                />
              </div>
            )}
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-purple-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-black/40 border border-purple-500/25 text-white placeholder-zinc-500 text-sm focus:border-purple-400/60"
                required
              />
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-purple-400" />
              <input
                type={showPw ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full pl-10 pr-10 py-3 rounded-xl bg-black/40 border border-purple-500/25 text-white placeholder-zinc-500 text-sm focus:border-purple-400/60"
                required
              />
              <button
                type="button"
                onClick={() => setShowPw(!showPw)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-purple-400 hover:text-purple-200"
              >
                {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {error && (
              <div className="text-sm text-red-300 bg-red-500/10 border border-red-500/30 rounded-lg px-3 py-2">
                {error}
              </div>
            )}

            <NeonButton type="submit" variant="purple" loading={loading} className="w-full py-3">
              <span className="flex items-center justify-center gap-2">
                {isRegister ? "Create Account" : "Sign In"}
                <ArrowRight className="w-4 h-4" />
              </span>
            </NeonButton>
          </form>

          <div className="mt-6 text-center text-sm text-zinc-400">
            {isRegister ? "Already have an account?" : "Need an account?"}{" "}
            <Link
              to={isRegister ? "/login" : "/register"}
              className="text-purple-300 hover:text-purple-100 font-medium"
            >
              {isRegister ? "Sign in" : "Register"}
            </Link>
          </div>

          <div className="mt-6 pt-6 border-t border-purple-500/10">
            <p className="text-[10px] uppercase tracking-widest text-zinc-500 text-center mb-2">
              Demo credentials pre-filled
            </p>
            <p className="text-[11px] text-zinc-400 text-center">
              Just click <span className="text-purple-300">Sign In</span> to explore the dashboard
            </p>
          </div>
        </div>

        <p className="text-center text-xs text-zinc-500 mt-6">
          Protected by military-grade encryption • JWT auth • v2.4.1
        </p>
      </motion.div>
    </div>
  );
}
