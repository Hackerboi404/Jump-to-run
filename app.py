import logging
import sqlite3
import json
import threading
from flask import Flask
from telegram import Update, InlineKeyboardButton, InlineKeyboardMarkup, WebAppInfo
from telegram.ext import ApplicationBuilder, CommandHandler, ContextTypes, MessageHandler, filters

# ====== CONFIG ======
# Apni detail yahan bharein
TOKEN = "8716842152:AAE_3JlzLZjr_Vgi9_Hax6rJBgmKAv5w0eQ" 
GAME_URL = "https://hackerboi404.github.io/Jump-to-run/"

# Logging setup
logging.basicConfig(format='%(asctime)s - %(name)s - %(levelname)s - %(message)s', level=logging.INFO)

# ====== DATABASE ======
def init_db():
    conn = sqlite3.connect("scores.db")
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
    conn = sqlite3.connect("scores.db")
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
    conn = sqlite3.connect("scores.db")
    cursor = conn.cursor()
    cursor.execute("SELECT username, score FROM leaderboard ORDER BY score DESC LIMIT 10")
    rows = cursor.fetchall()
    conn.close()
    return rows

# ====== TELEGRAM BOT HANDLERS ======
async def start(update: Update, context: ContextTypes.DEFAULT_TYPE):
    welcome_text = (
        "👋 *Welcome to Neon JuMp And Run Bot!*\n\n"
        "🎮 Use /game to start playing.\n"
        "🏆 Use /score to see the top players."
    )
    await update.message.reply_text(welcome_text, parse_mode="Markdown")

async def game_command(update: Update, context: ContextTypes.DEFAULT_TYPE):
    # Intermediate Message with 'Okay' Button
    game_text = (
        "🚀 *NEON ARCHERY DASH*\n\n"
        "Prepare yourself! Dodge the neon pillars and set a new record.\n\n"
        "Ready to play?"
    )
    
    keyboard = [
        [InlineKeyboardButton("✅ OKAY, LET'S PLAY! 🎮", web_app=WebAppInfo(url=GAME_URL))]
    ]
    reply_markup = InlineKeyboardMarkup(keyboard)
    
    await update.message.reply_text(game_text, reply_markup=reply_markup, parse_mode="Markdown")

async def score_command(update: Update, context: ContextTypes.DEFAULT_TYPE):
    top_users = get_leaderboard()
    if not top_users:
        await update.message.reply_text("📉 No one has played yet! Be the first to score. 😉")
        return
        
    msg = "🏆 *TOP 10 NEON ARCHERS* 🏆\n\n"
    for i, (user, score) in enumerate(top_users, 1):
        medal = "🥇" if i == 1 else "🥈" if i == 2 else "🥉" if i == 3 else "🔹"
        msg += f"{medal} {user} — *{score}*\n"
        
    await update.message.reply_text(msg, parse_mode="Markdown")

async def web_app_data(update: Update, context: ContextTypes.DEFAULT_TYPE):
    try:
        data = json.loads(update.effective_message.web_app_data.data)
        score = int(data.get("score", 0))
        user = update.effective_user
        
        # Save to SQLite
        update_score(user.id, user.first_name, score)
        
        await update.message.reply_text(f"🔥 *{user.first_name}*, your score of *{score}* has been saved to the leaderboard!", parse_mode="Markdown")
    except Exception as e:
        logging.error(f"Error handling web_app_data: {e}")
        await update.message.reply_text("⚠️ Oops! Something went wrong while saving your score.")

# ====== TELEGRAM APP SETUP ======
bot_app = ApplicationBuilder().token(TOKEN).build()
bot_app.add_handler(CommandHandler("start", start))
bot_app.add_handler(CommandHandler("game", game_command))
bot_app.add_handler(CommandHandler("score", score_command))
bot_app.add_handler(MessageHandler(filters.StatusUpdate.WEB_APP_DATA, web_app_data))

# ====== FLASK SERVER (For 24/7 Hosting) ======
flask_app = Flask(__name__)

@flask_app.route("/")
def home():
    return "Bot is alive and running!"

# ====== RUN EVERYTHING ======
def run_bot():
    print("Bot is starting...")
    bot_app.run_polling()

if __name__ == "__main__":
    init_db()
    # Flask runs in background, Bot runs in main thread
    threading.Thread(target=lambda: flask_app.run(host="0.0.0.0", port=10000), daemon=True).start()
    run_bot()
