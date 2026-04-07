import logging
import sqlite3
import json
import threading
from flask import Flask
from telegram import Update, InlineKeyboardButton, InlineKeyboardMarkup, WebAppInfo
from telegram.ext import ApplicationBuilder, CommandHandler, ContextTypes, MessageHandler, filters

TOKEN = "8716842152:AAE_3JlzLZjr_Vgi9_Hax6rJBgmKAv5w0eQ"
GAME_URL = "https://hackerboi404.github.io/Jump-to-run/"

# ================= DATABASE =================
def init_db():
    conn = sqlite3.connect('scores.db')
    cursor = conn.cursor()
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS leaderboard (
            user_id INTEGER PRIMARY KEY,
            username TEXT,
            score INTEGER
        )
    ''')
    conn.commit()
    conn.close()

def update_score(user_id, username, new_score):
    conn = sqlite3.connect('scores.db')
    cursor = conn.cursor()
    cursor.execute("SELECT score FROM leaderboard WHERE user_id = ?", (user_id,))
    row = cursor.fetchone()

    if row is None:
        cursor.execute("INSERT INTO leaderboard VALUES (?, ?, ?)", (user_id, username, new_score))
    elif new_score > row[0]:
        cursor.execute("UPDATE leaderboard SET score = ?, username = ? WHERE user_id = ?", (new_score, username, user_id))

    conn.commit()
    conn.close()

def get_leaderboard():
    conn = sqlite3.connect('scores.db')
    cursor = conn.cursor()
    cursor.execute("SELECT username, score FROM leaderboard ORDER BY score DESC LIMIT 10")
    rows = cursor.fetchall()
    conn.close()
    return rows

# ================= BOT HANDLERS =================
async def start(update: Update, context: ContextTypes.DEFAULT_TYPE):
    await update.message.reply_text("Welcome! Use /game to play or /score to see leaderboard.")

async def game_command(update: Update, context: ContextTypes.DEFAULT_TYPE):
    keyboard = [[InlineKeyboardButton("🎮 Play Game", web_app=WebAppInfo(url=GAME_URL))]]
    reply_markup = InlineKeyboardMarkup(keyboard)
    await update.message.reply_text("Game start karo 👇", reply_markup=reply_markup)

async def score_command(update: Update, context: ContextTypes.DEFAULT_TYPE):
    top_users = get_leaderboard()

    if not top_users:
        await update.message.reply_text("Abhi tak kisi ne nahi khela 😅")
        return

    msg = "🏆 TOP 10 PLAYERS 🏆\n\n"
    for i, (user, score) in enumerate(top_users, 1):
        msg += f"{i}. {user} — {score}\n"

    await update.message.reply_text(msg)

async def web_app_data(update: Update, context: ContextTypes.DEFAULT_TYPE):
    data = json.loads(update.effective_message.web_app_data.data)
    score = data.get('score', 0)
    user = update.effective_user

    update_score(user.id, user.first_name, score)
    await update.message.reply_text(f"🔥 {user.first_name}, score {score} save ho gaya!")

# ================= TELEGRAM BOT =================
bot_app = ApplicationBuilder().token(TOKEN).build()

bot_app.add_handler(CommandHandler("start", start))
bot_app.add_handler(CommandHandler("game", game_command))
bot_app.add_handler(CommandHandler("score", score_command))
bot_app.add_handler(MessageHandler(filters.StatusUpdate.WEB_APP_DATA, web_app_data))

# ================= FLASK SERVER =================
flask_app = Flask(__name__)

@flask_app.route("/")
def home():
    return "Bot is alive!"

# ================= RUN BOT IN THREAD =================
def run_bot():
    print("Bot started...")
    bot_app.run_polling()

if __name__ == "__main__":
    init_db()

    # Start bot in background thread
    threading.Thread(target=run_bot).start()

    # Start Flask (Render needs this)
    flask_app.run(host="0.0.0.0", port=10000)
