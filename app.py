import os
import random
import logging
from flask import Flask
from threading import Thread
from telegram import Update
from telegram.ext import ApplicationBuilder, ContextTypes, CommandHandler

# Logging setup taaki Render logs mein error dikhe
logging.basicConfig(format='%(asctime)s - %(name)s - %(levelname)s - %(message)s', level=logging.INFO)

app = Flask('')

@app.route('/')
def home():
    return "Roaster Bot is Online!"

def run_flask():
    port = int(os.environ.get("PORT", 8080))
    app.run(host='0.0.0.0', port=port)

TOKEN = os.environ.get('BOT_TOKEN')
roasting_tasks = {}

async def get_random_roast():
    try:
        # Check if file exists
        if not os.path.exists("roast.txt"):
            return "Bhai, 'roast.txt' file nahi mili GitHub pe!"
        
        with open("roast.txt", "r", encoding="utf-8") as f:
            lines = [line.strip() for line in f.readlines() if line.strip()]
            
        if not lines:
            return "Roast list khali hai, kuch toh likh usme!"
            
        return random.choice(lines)
    except Exception as e:
        return f"File reading error: {str(e)}"

# Roast function jo baar baar chalega
async def roasting_callback(context: ContextTypes.DEFAULT_TYPE):
    job = context.job
    message = await get_random_roast()
    target = job.data['target']
    
    try:
        await context.bot.send_message(chat_id=job.chat_id, text=f"{target} {message}")
    except Exception as e:
        logging.error(f"Failed to send roast: {e}")

async def start_command(update: Update, context: ContextTypes.DEFAULT_TYPE):
    await update.message.reply_text("👋 Bot chalu hai! `/roast @username` try kar.")

async def start_roast(update: Update, context: ContextTypes.DEFAULT_TYPE):
    chat_id = update.effective_chat.id
    
    if not context.args:
        await update.message.reply_text("❌ Kisko pelna hai? `/roast @username` likho.")
        return

    target_user = context.args[0]
    
    # 1. Purana task remove karo
    if chat_id in roasting_tasks:
        current_job = roasting_tasks.pop(chat_id)
        current_job.schedule_removal()

    # 2. Check if JobQueue is available
    if not context.job_queue:
        await update.message.reply_text("❌ JobQueue error! Bot setup mein dikkat hai.")
        return

    # 3. Naya Job schedule karo
    new_job = context.job_queue.run_repeating(
        roasting_callback, 
        interval=50, 
        first=1, # 1 second baad pehla roast
        chat_id=chat_id, 
        data={'target': target_user}
    )
    
    roasting_tasks[chat_id] = new_job
    await update.message.reply_text(f"🔥 Done! {target_user} ki roasting har 50s mein shuru.")

async def stop_roast(update: Update, context: ContextTypes.DEFAULT_TYPE):
    chat_id = update.effective_chat.id
    if chat_id in roasting_tasks:
        job = roasting_tasks.pop(chat_id)
        job.schedule_removal()
        await update.message.reply_text("✅ Roasting rok di gayi hai.")
    else:
        await update.message.reply_text("Koyi active roasting nahi mili.")

def main():
    # Flask in background
    Thread(target=run_flask).start()

    # Build application with JobQueue enabled
    application = ApplicationBuilder().token(TOKEN).build()
    
    # Handlers
    application.add_handler(CommandHandler("start", start_command))
    application.add_handler(CommandHandler("roast", start_roast))
    application.add_handler(CommandHandler("stop", stop_roast))
    
    application.run_polling()

if __name__ == '__main__':
    main()
