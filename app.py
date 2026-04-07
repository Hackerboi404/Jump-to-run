import logging
import sqlite3
import json
import os
import threading
from flask import Flask
from telegram import Update, InlineKeyboardButton, InlineKeyboardMarkup, WebAppInfo
from telegram.ext import ApplicationBuilder, CommandHandler, ContextTypes, MessageHandler, filters

# ====== CONFIG ======
TOKEN = "8716842152:AAE_3JlzLZjr_Vgi9_Hax6rJBgmKAv5w0eQ" 
GAME_URL = "https://hackerboi404.github.io/Jump-to-run/"

logging.basicConfig(
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    level=logging.INFO
)

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

def get_leaderboard():
    conn = sqlite3.connect("scores.db", check_same_thread=False)
    cursor = conn.cursor()
    cursor.execute("SELECT username, score FROM leaderboard ORDER BY score DESC LIMIT 10")
    rows = cursor.fetchall()
    conn.close()
    return rows

# ====== BOT HANDLERS ======

async def start(update: Update, context: ContextTypes.DEFAULT_TYPE):
    welcome_text = (
        f"👋 *Hey {update.effective_user.first_name}!*\n\n"
        "Main Neon DashGame Bot hoon. 🏹\n\n"
        "🎮 /game - Khelne ke liye\n"
        "🏆 /score - Top players dekhne ke liye"
    )
    await update.message.reply_text(welcome_text, parse_mode="Markdown")

async def game_command(update: Update, context: ContextTypes.DEFAULT_TYPE):
    # Fix for 'Button_type_invalid': 
    # Telegram groups mein WebApp button thoda sensitive hota hai.
    # Hum description thoda simple rakhenge.
    game_text = "🚀 *NEON ARCHERY DASH*\n\nReady to set a new record?"
    
    keyboard = [[InlineKeyboardButton("✅ OKAY, LET'S PLAY! 🎮", web_app=WebAppInfo(url=GAME_URL))]]
    reply_markup = InlineKeyboardMarkup(keyboard)
    
    try:
        await update.message.reply_text(game_text, reply_markup=reply_markup, parse_mode="Markdown")
    except Exception as e:
        # Fallback agar group mein error aaye
        logging.error(f"Error in game_command: {e}")
        await update.message.reply_text("Click here to play: " + GAME_URL)

async def score_command(update: Update, context: ContextTypes.DEFAULT_TYPE):
    top_users = get_leaderboard()
    if not top_users:
        await update.message.reply_text("📉 No one played yet.")
        return
    msg = "🏆 *TOP 10 PLAYERS* 🏆\n\n"
    for i, (user, score) in enumerate(top_users, 1):
        msg += f"{i}. {user} — *{score}*\n"
    await update.message.reply_text(msg, parse_mode="Markdown")

async def web_app_data(update: Update, context: ContextTypes.DEFAULT_TYPE):
    try:
        # Data fetch from WebApp
        data = json.loads(update.effective_message.web_app_data.data)
        score = int(data.get("score", 0))
        user = update.effective_user
        
        update_score(user.id, user.first_name, score)
        
        # User ko confirmation message bhejna
        await update.message.reply_text(f"🔥 *{user.first_name}*, score *{score}* saved!", parse_mode="Markdown")
    except Exception as e:
        logging.error(f"WebAppData Error: {e}")

# ====== FLASK ======
app_flask = Flask(__name__)
@app_flask.route('/')
def index(): return "Bot is running..."

def run_flask():
    port = int(os.environ.get("PORT", 10000))
    app_flask.run(host='0.0.0.0', port=port)

# ====== MAIN ======
if __name__ == "__main__":
    init_db()
    bot_app = ApplicationBuilder().token(TOKEN).build()
    
    bot_app.add_handler(CommandHandler("start", start))
    bot_app.add_handler(CommandHandler("game", game_command))
    bot_app.add_handler(CommandHandler("score", score_command))
    bot_app.add_handler(MessageHandler(filters.StatusUpdate.WEB_APP_DATA, web_app_data))

    threading.Thread(target=run_flask, daemon=True).start()
    bot_app.run_polling()
