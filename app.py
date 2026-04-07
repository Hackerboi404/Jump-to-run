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
    # Unique user_id ensures we only keep the highest score per player
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
    # Top 5 fetching
    cursor.execute("SELECT username, score FROM leaderboard ORDER BY score DESC LIMIT 5")
    rows = cursor.fetchall()
    conn.close()
    return [{"name": r[0], "score": r[1]} for r in rows]

# ====== FLASK API ======
app_flask = Flask(__name__)
CORS(app_flask) # Yeh browser ko data allow karega

@app_flask.route('/')
def index():
    return "Bot status: Active"

@app_flask.route('/api/leaderboard')
def api_leaderboard():
    data = get_leaderboard_data()
    return jsonify(data)

# ====== BOT HANDLERS ======
async def start(update: Update, context: ContextTypes.DEFAULT_TYPE):
    await update.message.reply_text(f"👋 Namaste {update.effective_user.first_name}!\n\nKhelne ke liye /game likhein.")

async def game_command(update: Update, context: ContextTypes.DEFAULT_TYPE):
    keyboard = [[InlineKeyboardButton("🎮 START GAME", web_app=WebAppInfo(url=GAME_URL))]]
    await update.message.reply_text("🏹 *NEON ARCHERY DASH*", reply_markup=InlineKeyboardMarkup(keyboard), parse_mode="Markdown")

async def web_app_data(update: Update, context: ContextTypes.DEFAULT_TYPE):
    try:
        # Score receiving from Game
        raw_data = update.effective_message.web_app_data.data
        data = json.loads(raw_data)
        score = int(data.get("score", 0))
        user = update.effective_user
        
        update_score(user.id, user.first_name, score)
        
        await update.message.reply_text(
            f"✅ *Score Saved!*\n👤 Player: {user.first_name}\n🎯 Score: {score}", 
            parse_mode="Markdown"
        )
    except Exception as e:
        logging.error(f"Error saving score: {e}")

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
