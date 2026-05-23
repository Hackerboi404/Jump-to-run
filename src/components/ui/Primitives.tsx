import { motion } from "framer-motion";
import { avatarColor, initials } from "../../data/mockData";
import clsx from "clsx";

export function Avatar({
  name,
  size = 40,
  status,
  className,
}: {
  name: string;
  size?: number;
  status?: "online" | "offline" | "recently";
  className?: string;
}) {
  const bg = avatarColor(name);
  return (
    <div className={clsx("relative inline-block shrink-0", className)}>
      <div
        className="flex items-center justify-center rounded-full font-semibold text-white select-none"
        style={{
          width: size,
          height: size,
          background: `linear-gradient(135deg, ${bg}, ${bg}99)`,
          fontSize: size * 0.38,
          boxShadow: `0 0 14px ${bg}66, inset 0 0 10px rgba(255,255,255,0.2)`,
        }}
      >
        {initials(name)}
      </div>
      {status && (
        <span
          className={clsx(
            "absolute bottom-0 right-0 rounded-full border-2 border-[#0a0514]",
            status === "online" && "bg-emerald-400 shadow-[0_0_8px_#34d399]",
            status === "offline" && "bg-zinc-500",
            status === "recently" && "bg-amber-400",
          )}
          style={{ width: size * 0.28, height: size * 0.28 }}
        />
      )}
    </div>
  );
}

export function GlassCard({
  children,
  className,
  glow = false,
  onClick,
}: {
  children: React.ReactNode;
  className?: string;
  glow?: boolean;
  onClick?: () => void;
}) {
  return (
    <div
      onClick={onClick}
      className={clsx(
        "glass rounded-2xl",
        glow && "animate-border-glow",
        onClick && "cursor-pointer hover:translate-y-[-2px] transition-transform",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function NeonButton({
  children,
  onClick,
  variant = "purple",
  className,
  type = "button",
  disabled,
  loading,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "purple" | "blue" | "ghost" | "danger";
  className?: string;
  type?: "button" | "submit";
  disabled?: boolean;
  loading?: boolean;
}) {
  const styles = {
    purple:
      "bg-gradient-to-r from-fuchsia-500 via-purple-500 to-indigo-500 text-white shadow-[0_0_20px_rgba(168,85,247,0.5)] hover:shadow-[0_0_30px_rgba(168,85,247,0.8)]",
    blue: "bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-[0_0_20px_rgba(59,130,246,0.5)] hover:shadow-[0_0_30px_rgba(59,130,246,0.8)]",
    ghost:
      "bg-white/5 border border-purple-500/30 text-purple-200 hover:bg-purple-500/10 hover:border-purple-400/50",
    danger:
      "bg-gradient-to-r from-red-500 to-pink-600 text-white shadow-[0_0_20px_rgba(239,68,68,0.5)] hover:shadow-[0_0_30px_rgba(239,68,68,0.8)]",
  };
  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      whileHover={{ y: -1 }}
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={clsx(
        "relative px-5 py-2.5 rounded-xl font-medium text-sm tracking-wide transition-all disabled:opacity-50 disabled:cursor-not-allowed",
        styles[variant],
        className,
      )}
    >
      {loading ? (
        <span className="flex items-center gap-2 justify-center">
          <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
          Loading...
        </span>
      ) : (
        children
      )}
    </motion.button>
  );
}

export function StatCard({
  label,
  value,
  icon,
  trend,
  color = "purple",
}: {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: string;
  color?: "purple" | "blue" | "cyan" | "pink" | "green" | "amber";
}) {
  const colorMap = {
    purple: "from-purple-500/20 to-fuchsia-500/5 border-purple-500/30 text-purple-300",
    blue: "from-blue-500/20 to-cyan-500/5 border-blue-500/30 text-blue-300",
    cyan: "from-cyan-500/20 to-teal-500/5 border-cyan-500/30 text-cyan-300",
    pink: "from-pink-500/20 to-rose-500/5 border-pink-500/30 text-pink-300",
    green: "from-emerald-500/20 to-green-500/5 border-emerald-500/30 text-emerald-300",
    amber: "from-amber-500/20 to-orange-500/5 border-amber-500/30 text-amber-300",
  };
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4, scale: 1.01 }}
      transition={{ duration: 0.3 }}
      className={clsx(
        "relative overflow-hidden rounded-2xl border bg-gradient-to-br p-5",
        colorMap[color],
      )}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs uppercase tracking-widest opacity-70">{label}</p>
          <p className="text-2xl sm:text-3xl font-bold text-white mt-2 neon-text-purple">
            {value}
          </p>
          {trend && (
            <p className="text-xs mt-2 text-emerald-300 flex items-center gap-1">
              <span>▲</span> {trend}
            </p>
          )}
        </div>
        <div className="p-2.5 rounded-xl bg-black/30 border border-white/10">{icon}</div>
      </div>
      <div className="absolute -bottom-10 -right-10 w-32 h-32 rounded-full bg-gradient-to-br from-white/5 to-transparent blur-2xl" />
    </motion.div>
  );
}

export function Badge({
  children,
  color = "purple",
}: {
  children: React.ReactNode;
  color?: "purple" | "blue" | "green" | "red" | "amber" | "gray";
}) {
  const map = {
    purple: "bg-purple-500/20 text-purple-200 border-purple-500/30",
    blue: "bg-blue-500/20 text-blue-200 border-blue-500/30",
    green: "bg-emerald-500/20 text-emerald-200 border-emerald-500/30",
    red: "bg-red-500/20 text-red-200 border-red-500/30",
    amber: "bg-amber-500/20 text-amber-200 border-amber-500/30",
    gray: "bg-zinc-500/20 text-zinc-200 border-zinc-500/30",
  };
  return (
    <span className={clsx("inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs border", map[color])}>
      {children}
    </span>
  );
}

export function StatusDot({ online }: { online: boolean }) {
  return (
    <span className="relative inline-flex">
      <span
        className={clsx(
          "w-2.5 h-2.5 rounded-full",
          online ? "bg-emerald-400" : "bg-red-400",
        )}
      />
      {online && (
        <span className="absolute inset-0 w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping opacity-75" />
      )}
    </span>
  );
}
