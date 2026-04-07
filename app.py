import logging
import sqlite3
import json
import os
import threading
from flask import Flask, jsonify
from flask_cors import CORS
from telegram import Update, InlineKeyboardButton, InlineKeyboardMarkup, WebAppInfo
from telegram.ext import ApplicationBuilder, CommandHandler, ContextTypes, MessageHandler, filters

# ====== CONFIG ======
TOKEN = "8716842152:AAE_3JlzLZjr_Vgi9_Hax6rJBgmKAv5w0eQ" 
GAME_URL = "https://hackerboi404.github.io/Jump-to-run/"

logging.basicConfig(level=logging.INFO)

# ====== DATABASE ======
def init_db():
    conn = sqlite3.connect("scores.db", check_same_thread=False)
    cursor = conn.cursor()
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS leaderboard (
            user_id INTEGER PRIMARY KEY,
            username TEXT,
            score INTEGER
        )
    """)
    conn.commit()
    conn.close()

def update_score(user_id, username, new_score):
    conn = sqlite3.connect("scores.db", check_same_thread=False)
    cursor = conn.cursor()
    cursor.execute("SELECT score FROM leaderboard WHERE user_id = ?", (user_id,))
    row = cursor.fetchone()
    if row is None:
        cursor.execute("INSERT INTO leaderboard VALUES (?, ?, ?)", (user_id, username, new_score))
    elif new_score > row[0]:
        cursor.execute("UPDATE leaderboard SET score = ?, username = ? WHERE user_id = ?", (new_score, username, user_id))
    conn.commit()
    conn.close()

def get_leaderboard_data():
    conn = sqlite3.connect("scores.db", check_same_thread=False)
    cursor = conn.cursor()
    cursor.execute("SELECT username, score FROM leaderboard ORDER BY score DESC LIMIT 5")
    rows = cursor.fetchall()
    conn.close()
    return [{"name": r[0], "score": r[1]} for r in rows]

# ====== FLASK API ======
app_flask = Flask(__name__)
CORS(app_flask)

@app_flask.route('/')
def index(): return "Bot is running..."

@app_flask.route('/api/leaderboard')
def api_leaderboard():
    data = get_leaderboard_data()
    return jsonify(data)

# ====== BOT HANDLERS ======
async def start(update: Update, context: ContextTypes.DEFAULT_TYPE):
    await update.message.reply_text(f"👋 Hey {update.effective_user.first_name}!\n/game dabao khelne ke liye.")

async def game_command(update: Update, context: ContextTypes.DEFAULT_TYPE):
    keyboard = [[InlineKeyboardButton("✅ OKAY, LET'S PLAY! 🎮", web_app=WebAppInfo(url=GAME_URL))]]
    await update.message.reply_text("🚀 *NEON ARCHERY DASH*", reply_markup=InlineKeyboardMarkup(keyboard), parse_mode="Markdown")

async def web_app_data(update: Update, context: ContextTypes.DEFAULT_TYPE):
    try:
        # Game se score data nikaalna
        data = json.loads(update.effective_message.web_app_data.data)
        score = int(data.get("score", 0))
        user_name = update.effective_user.first_name
        user_id = update.effective_user.id
        
        # Database mein update karna
        update_score(user_id, user_name, score)
        
        # Telegram par Name aur Score ke saath message bhejna
        # Yahan message format change kiya gaya hai
        await update.message.reply_text(
            f"🎯 *Game Over!*\n\n"
            f"👤 *Player:* {user_name}\n"
            f"🔥 *Score:* {score}\n\n"
            f"Leaderboard check karne ke liye /score dabayein!",
            parse_mode="Markdown"
        )
    except Exception as e:
        logging.error(f"WebAppData Error: {e}")

def run_flask():
    port = int(os.environ.get("PORT", 10000))
    app_flask.run(host='0.0.0.0', port=port)

if __name__ == "__main__":
    init_db()
    bot_app = ApplicationBuilder().token(TOKEN).build()
    bot_app.add_handler(CommandHandler("start", start))
    bot_app.add_handler(CommandHandler("game", game_command))
    bot_app.add_handler(CommandHandler("score", lambda u, c: u.message.reply_text("🏆 Leaderboard API is active! Check in-game.")))
    bot_app.add_handler(MessageHandler(filters.StatusUpdate.WEB_APP_DATA, web_app_data))
    
    threading.Thread(target=run_flask, daemon=True).start()
    bot_app.run_polling()
