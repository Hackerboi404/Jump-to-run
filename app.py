import os
import random
import asyncio
from flask import Flask
from threading import Thread
from telegram import Update
from telegram.ext import ApplicationBuilder, ContextTypes, CommandHandler

# --- Flask Server Setup ---
app = Flask('')

@app.route('/')
def home():
    return "Bot is alive!"

def run_flask():
    # Render automatically sets the PORT environment variable
    port = int(os.environ.get("PORT", 8080))
    app.run(host='0.0.0.0', port=port)

# --- Telegram Bot Logic ---
TOKEN = os.environ.get('BOT_TOKEN') # Render environment variables se uthayega
roasting_tasks = {}

async def get_random_roast():
    try:
        with open("roast.txt", "r", encoding="utf-8") as f:
            lines = f.readlines()
            return random.choice(lines).strip() if lines else "Roast file khali hai!"
    except FileNotFoundError:
        return "roast.txt file nahi mili!"

async def roasting_loop(context: ContextTypes.DEFAULT_TYPE):
    job = context.job
    chat_id = job.chat_id
    target_user = job.data['target']
    message = await get_random_roast()
    await context.bot.send_message(chat_id=chat_id, text=f"Hey @{target_user.replace('@', '')}, {message}")

async def start_roast(update: Update, context: ContextTypes.DEFAULT_TYPE):
    chat_id = update.effective_chat.id
    if not context.args:
        await update.message.reply_text("Usage: /roast @username")
        return
    
    target_user = context.args[0]
    if chat_id in roasting_tasks:
        roasting_tasks[chat_id].schedule_removal()

    new_job = context.job_queue.run_repeating(
        roasting_loop, interval=50, first=1, chat_id=chat_id, data={'target': target_user}
    )
    roasting_tasks[chat_id] = new_job
    await update.message.reply_text(f"Mission Started! 😈 Target: {target_user}")

async def stop_roast(update: Update, context: ContextTypes.DEFAULT_TYPE):
    chat_id = update.effective_chat.id
    if chat_id in roasting_tasks:
        roasting_tasks[chat_id].schedule_removal()
        del roasting_tasks[chat_id]
        await update.message.reply_text("Theek hai, roast rok diya. ✅")

def main():
    # Flask ko background thread mein start karein
    Thread(target=run_flask).start()

    # Bot start karein
    bot_app = ApplicationBuilder().token(TOKEN).build()
    bot_app.add_handler(CommandHandler("roast", start_roast))
    bot_app.add_handler(CommandHandler("stop", stop_roast))
    
    print("Bot is running...")
    bot_app.run_polling()

if __name__ == '__main__':
    main()
