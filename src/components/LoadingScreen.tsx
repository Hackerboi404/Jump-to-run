import { motion } from "framer-motion";
import { Shield } from "lucide-react";

export function LoadingScreen() {
  return (
    <div className="fixed inset-0 z-50 bg-[#05020e] flex items-center justify-center">
      <div className="absolute inset-0 grid-bg opacity-30" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-purple-600/20 rounded-full blur-[120px]" />

      <div className="relative flex flex-col items-center">
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 0.8, type: "spring" }}
          className="relative"
        >
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-500 via-fuchsia-500 to-blue-500 flex items-center justify-center neon-purple">
            <Shield className="w-10 h-10 text-white" />
          </div>
          <motion.div
            animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute inset-0 rounded-2xl bg-purple-500/40 blur-2xl -z-10"
          />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-8 text-2xl font-bold gradient-text"
        >
          ShadowPanel
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-xs uppercase tracking-[0.3em] text-purple-300/60 mt-2"
        >
          Establishing secure connection
        </motion.p>

        <div className="mt-8 flex gap-1.5">
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              animate={{ y: [0, -8, 0], opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.15 }}
              className="w-2 h-2 rounded-full bg-gradient-to-b from-purple-400 to-blue-400 shadow-[0_0_8px_#a855f7]"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
