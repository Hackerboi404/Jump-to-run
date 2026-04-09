import logging
import sqlite3
import os
import threading
from flask import Flask, jsonify, request
from flask_cors import CORS
from telegram import Update, InlineKeyboardButton, InlineKeyboardMarkup, WebAppInfo
from telegram.ext import ApplicationBuilder, CommandHandler, ContextTypes

TOKEN = "8716842152:AAE_3JlzLZjr_Vgi9_Hax6rJBgmKAv5w0eQ"
GAME_URL = "https://hackerboi404.github.io/Jump-to-run/"

# 🔥 IMPORTANT: apna Telegram user ID daalo
ADMIN_ID = 8389404866  

logging.basicConfig(level=logging.INFO)

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

app_flask = Flask(__name__)
CORS(app_flask)

@app_flask.route('/api/save_score', methods=['POST'])
def save_score():
    data = request.json
    uid, name, score = data.get("user_id"), data.get("name"), data.get("score")

    if uid:
        conn = sqlite3.connect("scores.db", check_same_thread=False)
        cursor = conn.cursor()

        cursor.execute("SELECT score FROM leaderboard WHERE user_id = ?", (uid,))
        row = cursor.fetchone()

        if not row or int(score) > int(row[0]):
            cursor.execute(
                "INSERT OR REPLACE INTO leaderboard VALUES (?, ?, ?)",
                (uid, name, score)
            )
            conn.commit()

        conn.close()
        return jsonify({"status": "success"})

    return jsonify({"status": "error"}), 400


@app_flask.route('/api/leaderboard')
def get_lb():
    conn = sqlite3.connect("scores.db", check_same_thread=False)
    cursor = conn.cursor()

    cursor.execute("""
        SELECT username, score 
        FROM leaderboard 
        ORDER BY score DESC 
        LIMIT 5
    """)

    rows = cursor.fetchall()
    conn.close()

    return jsonify([{"name": r[0], "score": r[1]} for r in rows])


# 🎮 GAME COMMAND
async def game_command(update: Update, context: ContextTypes.DEFAULT_TYPE):
    chat_type = update.effective_chat.type

    if chat_type == "private":
        keyboard = [[InlineKeyboardButton("🎮 PLAY", web_app=WebAppInfo(url=GAME_URL))]]
    else:
        keyboard = [[InlineKeyboardButton("🎮 PLAY", url=GAME_URL)]]

    await update.message.reply_text(
        "🎮 Use button to play!",
        reply_markup=InlineKeyboardMarkup(keyboard)
    )


# 🔥 ADMIN RESET COMMAND
async def reset_lb(update: Update, context: ContextTypes.DEFAULT_TYPE):
    user_id = update.effective_user.id

    if user_id != ADMIN_ID:
        await update.message.reply_text("❌ You are not allowed!")
        return

    conn = sqlite3.connect("scores.db")
    cursor = conn.cursor()
    cursor.execute("DELETE FROM leaderboard")
    conn.commit()
    conn.close()

    await update.message.reply_text("✅ Leaderboard reset ho gaya!")


if __name__ == "__main__":
    init_db()

    bot_app = ApplicationBuilder().token(TOKEN).build()

    bot_app.add_handler(CommandHandler("game", game_command))
    bot_app.add_handler(CommandHandler("resetlb", reset_lb))  # 🔥 added

    threading.Thread(
        target=lambda: app_flask.run(
            host='0.0.0.0',
            port=int(os.environ.get("PORT", 10000))
        ),
        daemon=True
    ).start()

    bot_app.run_polling()
