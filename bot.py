import logging
import sqlite3
import json
from telegram import Update, InlineKeyboardButton, InlineKeyboardMarkup, WebAppInfo
from telegram.ext import ApplicationBuilder, CommandHandler, ContextTypes, MessageHandler, filters

# Bot Token yahan dalein
TOKEN = 'YOUR_BOT_TOKEN_HERE'
# Game URL (Jahan index.html host hai)
GAME_URL = 'https://your-hosted-game.com/index.html'

# Database Setup
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

# Update Score Logic
def update_score(user_id, username, new_score):
    conn = sqlite3.connect('scores.db')
    cursor = conn.cursor()
    cursor.execute("SELECT score FROM leaderboard WHERE user_id = ?", (user_id,))
    row = cursor.fetchone()
    
    if row is None:
        cursor.execute("INSERT INTO leaderboard VALUES (?, ?, ?)", (user_id, username, new_score))
    elif new_score > row[0]: # Replace only if new score is higher
        cursor.execute("UPDATE leaderboard SET score = ?, username = ? WHERE user_id = ?", (new_score, username, user_id))
    
    conn.commit()
    conn.close()

# Get Top 10
def get_leaderboard():
    conn = sqlite3.connect('scores.db')
    cursor = conn.cursor()
    cursor.execute("SELECT username, score FROM leaderboard ORDER BY score DESC LIMIT 10")
    rows = cursor.fetchall()
    conn.close()
    return rows

async def start(update: Update, context: ContextTypes.DEFAULT_TYPE):
    await update.message.reply_text("Welcome! Use /game to play or /score to see leaderboard.")

async def game_command(update: Update, context: ContextTypes.DEFAULT_TYPE):
    keyboard = [[InlineKeyboardButton("🎮 Play Neon Archery", web_app=WebAppInfo(url=GAME_URL))]]
    reply_markup = InlineKeyboardMarkup(keyboard)
    await update.message.reply_text("Chalo shuru karte hain! Niche button pe click karo:", reply_markup=reply_markup)

async def score_command(update: Update, context: ContextTypes.DEFAULT_TYPE):
    top_users = get_leaderboard()
    if not top_users:
        await update.message.reply_text("Abhi tak kisi ne nahi khela. Pehle aap khelo!")
        return
    
    msg = "🏆 *TOP 10 PLAYERS* 🏆\n\n"
    for i, (user, score) in enumerate(top_users, 1):
        msg += f"{i}. {user} — {score}\n"
    
    await update.message.reply_markdown(msg)

# Handle Data from WebApp
async def web_app_data(update: Update, context: ContextTypes.DEFAULT_TYPE):
    data = json.loads(update.effective_message.web_app_data.data)
    score = data.get('score', 0)
    user = update.effective_user
    
    update_score(user.id, user.first_name, score)
    await update.message.reply_text(f"Shabash {user.first_name}! Aapka score {score} save ho gaya hai.")

if __name__ == '__main__':
    init_db()
    app = ApplicationBuilder().token(TOKEN).build()
    
    app.add_handler(CommandHandler("start", start))
    app.add_handler(CommandHandler("game", game_command))
    app.add_handler(CommandHandler("score", score_command))
    app.add_handler(MessageHandler(filters.StatusUpdate.WEB_APP_DATA, web_app_data))
    
    print("Bot is running...")
    app.run_polling()
