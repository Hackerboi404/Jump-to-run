import logging
import sqlite3
import json
import os
import threading
from flask import Flask, jsonify, request
from flask_cors import CORS
from telegram import Update, InlineKeyboardButton, InlineKeyboardMarkup, WebAppInfo
from telegram.ext import ApplicationBuilder, CommandHandler, ContextTypes, MessageHandler, filters

TOKEN = "8716842152:AAE_3JlzLZjr_Vgi9_Hax6rJBgmKAv5w0eQ"
GAME_URL = "https://hackerboi404.github.io/Jump-to-run/"

logging.basicConfig(level=logging.INFO)

# Database Setup
def init_db():
    conn = sqlite3.connect("scores.db", check_same_thread=False)
    cursor = conn.cursor()
    cursor.execute("CREATE TABLE IF NOT EXISTS leaderboard (user_id INTEGER PRIMARY KEY, username TEXT, score INTEGER)")
    conn.commit()
    conn.close()

app_flask = Flask(__name__)
CORS(app_flask)

@app_flask.route('/api/save_score', methods=['POST'])
def save_score():
    data = request.json
    uid, name, score = data.get("user_id"), data.get("name"), data.get("score")
    if uid:
        conn = sqlite3.connect("scores.db", check_same_thread=False)
        cursor = conn.cursor()
        cursor.execute("INSERT OR REPLACE INTO leaderboard VALUES (?, ?, ?)", (uid, name, score))
        conn.commit()
        conn.close()
        return jsonify({"status": "success"})
    return jsonify({"status": "error"}), 400

@app_flask.route('/api/leaderboard')
def get_lb():
    conn = sqlite3.connect("scores.db", check_same_thread=False)
    cursor = conn.cursor()
    cursor.execute("SELECT username, score FROM leaderboard ORDER BY score DESC LIMIT 10")
    data = [{"name": r[0], "score": r[1]} for r in rows := cursor.fetchall()]
    conn.close()
    return jsonify(data)

async def game_command(update: Update, context: ContextTypes.DEFAULT_TYPE):
    # Image jaisa button dene ke liye
    keyboard = [[InlineKeyboardButton("🎮 Play Neon Dash", web_app=WebAppInfo(url=GAME_URL))]]
    await update.message.reply_text("🔥 *CHALLENGE:* Kya aap Top 10 mein aa sakte hain?\nAbhi khelein aur apna score leaderboard par dekhein!", 
                                   reply_markup=InlineKeyboardMarkup(keyboard), parse_mode="Markdown")

if __name__ == "__main__":
    init_db()
    bot_app = ApplicationBuilder().token(TOKEN).build()
    bot_app.add_handler(CommandHandler("game", game_command))
    # Flask runner
    threading.Thread(target=lambda: app_flask.run(host='0.0.0.0', port=int(os.environ.get("PORT", 10000))), daemon=True).start()
    bot_app.run_polling()
