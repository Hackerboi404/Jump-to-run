import logging
import sqlite3
import json
import os
import threading
from flask import Flask, jsonify, request
from flask_cors import CORS
from telegram import Update, InlineKeyboardButton, InlineKeyboardMarkup, WebAppInfo
from telegram.ext import ApplicationBuilder, CommandHandler, ContextTypes, MessageHandler, filters

# ====== CONFIG (TOKEN YAHI RAHNE DO) ======
TOKEN = "8716842152:AAE_3JlzLZjr_Vgi9_Hax6rJBgmKAv5w0eQ"
GAME_URL = "https://hackerboi404.github.io/Jump-to-run/" # Aapka GitHub Link

logging.basicConfig(level=logging.INFO)

# ====== DATABASE SETUP ======
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

def save_to_db(uid, name, score):
    conn = sqlite3.connect("scores.db", check_same_thread=False)
    cursor = conn.cursor()
    # Sirf tab update hoga agar naya score purane se zyada hai (Highscore logic)
    cursor.execute("SELECT score FROM leaderboard WHERE user_id = ?", (uid,))
    row = cursor.fetchone()
    if row is None:
        cursor.execute("INSERT INTO leaderboard VALUES (?, ?, ?)", (uid, name, score))
    elif score > row[0]:
        cursor.execute("UPDATE leaderboard SET score = ?, username = ? WHERE user_id = ?", (score, name, uid))
    conn.commit()
    conn.close()

# ====== FLASK API (FOR GAME) ======
app_flask = Flask(__name__)
CORS(app_flask)

@app_flask.route('/api/leaderboard')
def api_lb():
    conn = sqlite3.connect("scores.db", check_same_thread=False)
    cursor = conn.cursor()
    cursor.execute("SELECT username, score FROM leaderboard ORDER BY score DESC LIMIT 5")
    rows = cursor.fetchall()
    conn.close()
    return jsonify([{"name": r[0], "score": r[1]} for r in rows])

@app_flask.route('/api/save_score', methods=['POST'])
def api_save():
    data = request.json
    save_to_db(data.get("user_id"), data.get("name"), data.get("score"))
    return jsonify({"status": "success"})

# ====== BOT LOGIC ======
async def start(update: Update, context: ContextTypes.DEFAULT_TYPE):
    await update.message.reply_text("👋 Welcome! Use /game to play Neon Archery.")

async def game_command(update: Update, context: ContextTypes.DEFAULT_TYPE):
    # Lumberjack jaisa direct play button
    keyboard = [[InlineKeyboardButton("🎮 PLAY NEON ARCHERY", web_app=WebAppInfo(url=GAME_URL))]]
    await update.message.reply_text(
        "🚀 *NEON ARCHERY DASH*\n\nCan you beat the highscore?",
        reply_markup=InlineKeyboardMarkup(keyboard),
        parse_mode="Markdown"
    )

# Jab user DM mein khel kar out hota hai toh Telegram automatically data bhejta hai
async def handle_web_data(update: Update, context: ContextTypes.DEFAULT_TYPE):
    data = json.loads(update.effective_message.web_app_data.data)
    score = data.get("score")
    user = update.effective_user
    save_to_db(user.id, user.first_name, score)
    await update.message.reply_text(f"🏆 *Highscore Saved:* {score}", parse_mode="Markdown")

if __name__ == "__main__":
    init_db()
    bot_app = ApplicationBuilder().token(TOKEN).build()
    bot_app.add_handler(CommandHandler("start", start))
    bot_app.add_handler(CommandHandler("game", game_command))
    bot_app.add_handler(MessageHandler(filters.StatusUpdate.WEB_APP_DATA, handle_web_data))
    
    # Run Flask and Bot together
    port = int(os.environ.get("PORT", 10000))
    threading.Thread(target=lambda: app_flask.run(host='0.0.0.0', port=port), daemon=True).start()
    bot_app.run_polling()
