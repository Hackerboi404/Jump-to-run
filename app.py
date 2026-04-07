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
    # SQLite connection with thread safety for Render
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
    
    # Hum hamesha username update karte hain taaki leaderboard pe latest naam dikhe
    if row is None:
        cursor.execute("INSERT INTO leaderboard VALUES (?, ?, ?)", (user_id, username, new_score))
    elif new_score > row[0]:
        cursor.execute("UPDATE leaderboard SET score = ?, username = ? WHERE user_id = ?", (new_score, username, user_id))
    else:
        # Agar high score nahi bhi hai, tab bhi username update kar sakte hain
        cursor.execute("UPDATE leaderboard SET username = ? WHERE user_id = ?", (username, user_id))
        
    conn.commit()
    conn.close()

def get_leaderboard_data():
    conn = sqlite3.connect("scores.db", check_same_thread=False)
    cursor = conn.cursor()
    cursor.execute("SELECT username, score FROM leaderboard ORDER BY score DESC LIMIT 5")
    rows = cursor.fetchall()
    conn.close()
    return [{"name": r[0], "score": r[1]} for r in rows]

# ====== FLASK API FOR IN-GAME LEADERBOARD ======
app_flask = Flask(__name__)
CORS(app_flask)

@app_flask.route('/')
def index(): return "Bot is alive!"

@app_flask.route('/api/leaderboard')
def api_leaderboard():
    data = get_leaderboard_data()
    return jsonify(data)

# ====== BOT HANDLERS ======

async def start(update: Update, context: ContextTypes.DEFAULT_TYPE):
    await update.message.reply_text(f"👋 Hey {update.effective_user.first_name}!\nUse /game to play.")

async def game_command(update: Update, context: ContextTypes.DEFAULT_TYPE):
    # FIX: Button_type_invalid error bypass
    # Hum check karte hain ki chat group hai ya private
    chat_type = update.effective_chat.type
    
    text = "🚀 *NEON ARCHERY DASH*\n\nReady to set a new record?"
    
    # WebApp button
    keyboard = [[InlineKeyboardButton("🎮 PLAY NOW", web_app=WebAppInfo(url=GAME_URL))]]
    reply_markup = InlineKeyboardMarkup(keyboard)

    try:
        await update.message.reply_text(text, reply_markup=reply_markup, parse_mode="Markdown")
    except Exception as e:
        logging.error(f"Error sending game button: {e}")
        # Fallback: Agar button fail ho jaye toh direct link
        await update.message.reply_text(f"Play here: {GAME_URL}")

async def web_app_data(update: Update, context: ContextTypes.DEFAULT_TYPE):
    try:
        # Yeh tab trigger hota hai jab user DM mein khel kar out hota hai
        raw_data = update.effective_message.web_app_data.data
        data = json.loads(raw_data)
        score = int(data.get("score", 0))
        user = update.effective_user
        
        update_score(user.id, user.first_name, score)
        
        await update.message.reply_text(
            f"🎯 *Score Saved!*\n👤 {user.first_name}\n🔥 Score: {score}", 
            parse_mode="Markdown"
        )
    except Exception as e:
        logging.error(f"WebAppData Error: {e}")

# ====== RUNNER ======
def run_flask():
    port = int(os.environ.get("PORT", 10000))
    app_flask.run(host='0.0.0.0', port=port)

if __name__ == "__main__":
    init_db()
    bot_app = ApplicationBuilder().token(TOKEN).build()
    
    bot_app.add_handler(CommandHandler("start", start))
    bot_app.add_handler(CommandHandler("game", game_command))
    bot_app.add_handler(MessageHandler(filters.StatusUpdate.WEB_APP_DATA, web_app_data))

    threading.Thread(target=run_flask, daemon=True).start()
    bot_app.run_polling()
