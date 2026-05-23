# 🛡️ ShadowPanel — Telegram Control Center

A futuristic, premium web dashboard for managing Telegram groups through a bot. Built with **React + Vite + Tailwind**, with a cyberpunk neon UI and real-time data streaming.

![ShadowPanel](https://img.shields.io/badge/version-2.4.1-purple?style=for-the-badge)
![React](https://img.shields.io/badge/React-18-61dafb?style=for-the-badge)
![Tailwind](https://img.shields.io/badge/Tailwind-4-38bdf8?style=for-the-badge)

---

## ✨ Features

- 🔐 **JWT Auth** — Secure login/register with session handling
- 🤖 **Bot Dashboard** — Live bot status, auto-reconnect indicator
- 📊 **Real-time Analytics** — Messages, members, growth, moderation
- 💬 **Live Chat Monitor** — Telegram-style chat with instant replies
- 👥 **User Management** — Profiles, warn history, ban/mute
- ⚡ **Automation Tools** — Welcome, bad-words, anti-link, flood, anti-raid
- 📈 **Charts** — Recharts-based area, bar, line & pie visualizations
- 🔔 **Browser Notifications** — Alerts for mentions, raids, events
- 🎨 **Theme System** — Cyberpunk, midnight, neon
- 📱 **Responsive** — Works on mobile, tablet, desktop
- ✨ **Premium UI** — Glassmorphism, neon glows, animated particles

## 🚀 Quick Start

```bash
# 1. Install
npm install

# 2. Copy env and fill in your credentials
cp .env.example .env

# 3. Start dev server
npm run dev

# 4. Build for production
npm run build
```

Open http://localhost:5173 and log in with the demo credentials pre-filled on the login page.

## 🔑 Credentials

**Never embed real tokens in frontend code.** Use `.env` variables — in production these live only on the server. The frontend never directly calls the Telegram API; it talks to your Node.js backend which holds the `BOT_TOKEN` securely.

## 🏗️ Architecture

```
┌──────────────────┐         ┌──────────────────┐         ┌──────────────┐
│  ShadowPanel UI  │◄─REST──►│  Node.js/Express │◄─MTProto/Bot API──►│   Telegram   │
│  (React + Vite)  │◄─WS────►│  + Socket.io     │         └──────────────┘
└──────────────────┘         │  + JWT + bcrypt  │
                             └─────────┬────────┘
                                       │
                                       ▼
                             ┌──────────────────┐
                             │    MongoDB       │
                             └──────────────────┘
```

## 📂 Project Structure

```
src/
├── App.tsx                     # Router + auth guards
├── main.tsx                    # Entry point
├── index.css                   # Tailwind + cyberpunk theme
├── components/
│   ├── Layout.tsx              # Sidebar + topbar shell
│   ├── ParticleBackground.tsx  # Animated neon particles
│   ├── LoadingScreen.tsx       # Boot sequence
│   └── ui/Primitives.tsx       # GlassCard, NeonButton, Avatar, etc.
├── contexts/
│   └── AuthContext.tsx         # JWT auth state
├── data/
│   └── mockData.ts             # Realistic mock Telegram data
└── pages/
    ├── AuthPage.tsx            # Login / Register
    ├── DashboardPage.tsx       # Command Center
    ├── GroupsPage.tsx          # Group Control
    ├── LiveChatPage.tsx        # Live Chat Monitor
    ├── UsersPage.tsx           # User Management
    ├── AutomationPage.tsx      # Automation Tools
    ├── AnalyticsPage.tsx       # Charts & stats
    └── SettingsPage.tsx        # Config & install guide
```

## 🔌 Connecting a Real Backend

The frontend is production-ready and communicates through:

- `POST /api/auth/login` — returns `{ token, user }`
- `POST /api/auth/register`
- `GET /api/groups` — groups where bot is admin
- `GET /api/messages/:chatId` — paginated messages
- `POST /api/messages/send` — `{ chatId, text }`
- `POST /api/moderation/:action` — ban/mute/warn/kick
- `WS /realtime` — live events stream (Telegraf events)

Replace the mock API calls in `AuthContext` and page components with real `fetch` / `socket.io-client` calls pointing at `VITE_API_URL`.

## 🛠️ Tech Stack

| Layer    | Tech                                      |
|----------|-------------------------------------------|
| UI       | React 18, Vite, Tailwind CSS v4          |
| Motion   | Framer Motion                             |
| Charts   | Recharts                                  |
| Icons    | Lucide React                              |
| Routing  | React Router v6                           |
| Backend* | Node.js, Express, Socket.io, Telegraf    |
| Database*| MongoDB + Mongoose                        |
| Auth*    | JWT + bcrypt                              |

\*Backend is architectural reference — this repo contains the fully-functional frontend.

---

Built with 💜 for the Telegram community.
