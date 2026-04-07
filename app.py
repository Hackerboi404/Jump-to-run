import logging
import sqlite3
import json
import os
import threading
from flask import Flask, jsonify, request
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

# ====== FLASK API ======
app_flask = Flask(__name__)
CORS(app_flask)

@app_flask.route('/api/leaderboard')
def api_leaderboard():
    conn = sqlite3.connect("scores.db", check_same_thread=False)
    cursor = conn.cursor()
    cursor.execute("SELECT username, score FROM leaderboard ORDER BY score DESC LIMIT 5")
    rows = cursor.fetchall()
    conn.close()
    return jsonify([{"name": r[0], "score": r[1]} for r in rows])

# NAYA: Direct Save Route (Agar Telegram sendData fail ho jaye)
@app_flask.route('/api/save_score', methods=['POST'])
def api_save_score():
    data = request.json
    uid = data.get("user_id")
    name = data.get("name", "Unknown")
    score = data.get("score", 0)
    if uid:
        update_score(uid, name, score)
        return jsonify({"status": "ok"})
    return jsonify({"status": "error"}), 400

# ====== BOT HANDLERS ======
async def start(update: Update, context: ContextTypes.DEFAULT_TYPE):
    await update.message.reply_text("🎮 Khelne ke liye /game likhein!")

async def game_command(update: Update, context: ContextTypes.DEFAULT_TYPE):
    keyboard = [[InlineKeyboardButton("🎮 PLAY NOW", web_app=WebAppInfo(url=GAME_URL))]]
    await update.message.reply_text("🚀 *NEON ARCHERY DASH*", reply_markup=InlineKeyboardMarkup(keyboard), parse_mode="Markdown")

async def web_app_data(update: Update, context: ContextTypes.DEFAULT_TYPE):
    try:
        data = json.loads(update.effective_message.web_app_data.data)
        update_score(update.effective_user.id, update.effective_user.first_name, int(data.get("score", 0)))
        await update.message.reply_text(f"🔥 Score Saved: {data.get('score')}!")
    except: pass

if __name__ == "__main__":
    init_db()
    bot_app = ApplicationBuilder().token(TOKEN).build()
    bot_app.add_handler(CommandHandler("start", start))
    bot_app.add_handler(CommandHandler("game", game_command))
    bot_app.add_handler(MessageHandler(filters.StatusUpdate.WEB_APP_DATA, web_app_data))
    threading.Thread(target=lambda: app_flask.run(host='0.0.0.0', port=int(os.environ.get("PORT", 10000))), daemon=True).start()
    bot_app.run_polling()
