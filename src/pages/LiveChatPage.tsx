import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Search, Send, Pin, Trash2, Reply, Filter, Image as ImageIcon, Smile, CheckCheck } from "lucide-react";
import { Avatar, GlassCard } from "../components/ui/Primitives";
import { mockGroups, mockMessages, type TelegramMessage } from "../data/mockData";

export function LiveChatPage() {
  const [activeGroup, setActiveGroup] = useState(mockGroups[0]);
  const [messages, setMessages] = useState<TelegramMessage[]>(mockMessages);
  const [input, setInput] = useState("");
  const [filter, setFilter] = useState<"all" | "text" | "media">("all");
  const [search] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  const groupMessages = messages
    .filter((m) => m.chatId === activeGroup.id)
    .filter((m) => (filter === "all" ? true : filter === "media" ? m.type !== "text" : m.type === "text"))
    .filter((m) => m.text.toLowerCase().includes(search.toLowerCase()));

  // Simulate live incoming messages
  useEffect(() => {
    const interval = setInterval(() => {
      setMessages((prev) => {
        const sample = mockMessages[Math.floor(Math.random() * mockMessages.length)];
        const newMsg: TelegramMessage = {
          ...sample,
          id: Date.now() + Math.random(),
          chatId: activeGroup.id,
          chatTitle: activeGroup.title,
          timestamp: Date.now(),
          text: sample.text,
        };
        return [...prev.slice(-200), newMsg];
      });
    }, 5000);
    return () => clearInterval(interval);
  }, [activeGroup]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [groupMessages.length, activeGroup]);

  const handleSend = () => {
    if (!input.trim()) return;
    const me = { id: 0, username: "you", firstName: "You", status: "online" as const, joinDate: "", messageCount: 0, warns: 0 };
    const newMsg: TelegramMessage = {
      id: Date.now(),
      chatId: activeGroup.id,
      chatTitle: activeGroup.title,
      from: me,
      text: input,
      timestamp: Date.now(),
      type: "text",
    };
    setMessages((p) => [...p, newMsg]);
    setInput("");
  };

  const deleteMessage = (id: number) => {
    setMessages((p) => p.filter((m) => m.id !== id));
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold gradient-text">Live Chat Monitor</h1>
        <p className="text-sm text-zinc-400 mt-1 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          Streaming messages in real time from Telegram
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 h-[calc(100vh-220px)] min-h-[500px]">
        {/* Chat list */}
        <GlassCard className="p-4 overflow-y-auto lg:col-span-1">
          <div className="relative mb-3">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-purple-400" />
            <input
              placeholder="Chats..."
              className="w-full pl-9 pr-3 py-2 rounded-lg bg-black/40 border border-purple-500/20 text-sm text-white placeholder-zinc-500"
            />
          </div>
          <div className="space-y-1">
            {mockGroups.map((g) => {
              const last = messages.filter((m) => m.chatId === g.id).slice(-1)[0];
              const active = activeGroup.id === g.id;
              return (
                <button
                  key={g.id}
                  onClick={() => setActiveGroup(g)}
                  className={`w-full flex items-center gap-3 p-2.5 rounded-xl transition text-left ${
                    active
                      ? "bg-gradient-to-r from-purple-500/30 to-blue-500/10 border border-purple-500/30"
                      : "hover:bg-white/5"
                  }`}
                >
                  <Avatar name={g.title} size={38} status={active ? "online" : undefined} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">{g.title}</p>
                    <p className="text-xs text-zinc-500 truncate">
                      {last?.text || "No messages yet"}
                    </p>
                  </div>
                  {active && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />}
                </button>
              );
            })}
          </div>
        </GlassCard>

        {/* Chat window */}
        <GlassCard className="lg:col-span-3 flex flex-col overflow-hidden">
          {/* Header */}
          <div className="p-4 border-b border-purple-500/15 flex items-center gap-3">
            <Avatar name={activeGroup.title} size={40} status="online" />
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-white">{activeGroup.title}</p>
              <p className="text-xs text-emerald-300 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                {activeGroup.onlineCount} online · {activeGroup.memberCount.toLocaleString()} members
              </p>
            </div>
            <div className="hidden sm:flex items-center gap-1 bg-black/40 rounded-lg border border-purple-500/20 p-1">
              {(["all", "text", "media"] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-3 py-1 rounded-md text-xs transition ${
                    filter === f ? "bg-purple-500/30 text-white" : "text-zinc-400 hover:text-white"
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
            <button className="p-2 rounded-lg hover:bg-white/5 text-purple-300">
              <Filter className="w-4 h-4" />
            </button>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3 scan-line relative">
            {groupMessages.length === 0 && (
              <div className="h-full flex items-center justify-center text-zinc-500 text-sm">
                No messages match your filter
              </div>
            )}
            {groupMessages.map((m, idx) => {
              const isMe = m.from.username === "you";
              const showAvatar =
                idx === 0 || groupMessages[idx - 1]?.from.id !== m.from.id;
              return (
                <motion.div
                  key={m.id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex gap-2 group ${isMe ? "flex-row-reverse" : ""}`}
                >
                  {!isMe && showAvatar ? (
                    <Avatar name={m.from.firstName + " " + (m.from.lastName || "")} size={32} />
                  ) : !isMe ? (
                    <div className="w-8" />
                  ) : null}
                  <div className={`flex flex-col ${isMe ? "items-end" : "items-start"} max-w-[75%]`}>
                    {showAvatar && !isMe && (
                      <span className="text-xs text-purple-300 mb-0.5 px-2">
                        {m.from.firstName}
                      </span>
                    )}
                    <div
                      className={`relative px-3 py-2 rounded-2xl text-sm ${
                        isMe
                          ? "bg-gradient-to-br from-purple-500/40 to-blue-500/30 border border-purple-500/30 text-white"
                          : "bg-black/40 border border-purple-500/15 text-zinc-100"
                      }`}
                    >
                      {m.pinned && <Pin className="w-3 h-3 inline mr-1 text-amber-400" />}
                      {m.text}
                      <div
                        className={`text-[10px] mt-1 flex items-center gap-1 ${
                          isMe ? "text-purple-200/70" : "text-zinc-500"
                        }`}
                      >
                        {new Date(m.timestamp).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                        {m.edited && <span>edited</span>}
                        {isMe && <CheckCheck className="w-3 h-3 text-blue-300" />}
                      </div>

                      {/* Hover actions */}
                      <div className="absolute top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition flex gap-1 bg-black/80 rounded-lg p-1 border border-purple-500/30 backdrop-blur-sm z-10"
                        style={isMe ? { left: -90 } : { right: -90 }}>
                        <button className="p-1 hover:bg-purple-500/30 rounded text-purple-200" title="Reply">
                          <Reply className="w-3 h-3" />
                        </button>
                        <button className="p-1 hover:bg-purple-500/30 rounded text-purple-200" title="Pin">
                          <Pin className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => deleteMessage(m.id)}
                          className="p-1 hover:bg-red-500/30 rounded text-red-300"
                          title="Delete"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Composer */}
          <div className="p-3 border-t border-purple-500/15 flex items-center gap-2">
            <button className="p-2 text-purple-300 hover:text-white">
              <ImageIcon className="w-5 h-5" />
            </button>
            <button className="p-2 text-purple-300 hover:text-white">
              <Smile className="w-5 h-5" />
            </button>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Reply as the bot..."
              className="flex-1 px-4 py-2.5 rounded-xl bg-black/40 border border-purple-500/25 text-sm text-white placeholder-zinc-500"
            />
            <button
              onClick={handleSend}
              className="p-2.5 rounded-xl bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-[0_0_16px_rgba(168,85,247,0.5)] hover:shadow-[0_0_24px_rgba(168,85,247,0.8)] transition"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
