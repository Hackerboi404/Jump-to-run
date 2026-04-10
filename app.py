import os
import random
import asyncio
from flask import Flask
from threading import Thread
from telegram import Update
from telegram.ext import ApplicationBuilder, ContextTypes, CommandHandler

# --- Flask Server (Render Support) ---
app = Flask('')

@app.route('/')
def home():
    return "Roaster Bot is Online!"

def run_flask():
    port = int(os.environ.get("PORT", 8080))
    app.run(host='0.0.0.0', port=port)

# --- Bot Logic ---
TOKEN = os.environ.get('BOT_TOKEN')
roasting_tasks = {}

async def get_random_roast():
    try:
        if not os.path.exists("roast.txt"):
            return "Bhai, roast.txt file toh bana le pehle!"
        with open("roast.txt", "r", encoding="utf-8") as f:
            lines = [line.strip() for line in f.readlines() if line.strip()]
            return random.choice(lines) if lines else "Roast list khali hai!"
    except Exception as e:
        return f"Error: {str(e)}"

# Welcome Message Function
async def start_command(update: Update, context: ContextTypes.DEFAULT_TYPE):
    welcome_text = (
        "👋 **Arey Welcome Bhai!**\n\n"
        "Main taiyar hoon doston ki bezzati karne ke liye. 😂\n\n"
        "Commands:\n"
        "🚀 `/roast @username` - Roasting shuru karne ke liye\n"
        "🛑 `/stop` - Reham khane ke liye (Stop)"
    )
    await update.message.reply_text(welcome_text, parse_mode='Markdown')

async def roasting_loop(context: ContextTypes.DEFAULT_TYPE):
    job = context.job
    chat_id = job.chat_id
    target_user = job.data['target']
    
    message = await get_random_roast()
    final_text = f"Oye {target_user}, {message} 💀"
    
    await context.bot.send_message(chat_id=chat_id, text=final_text)

async def start_roast(update: Update, context: ContextTypes.DEFAULT_TYPE):
    chat_id = update.effective_chat.id
    
    if not context.args:
        await update.message.reply_text("❌ Username toh daal! Example: `/roast @dost`", parse_mode='Markdown')
        return

    target_user = context.args[0]
    
    # Instant Confirmation
    await update.message.reply_text(f"🔥 Mission Start! Ab {target_user} ki waat lagegi har 50 seconds mein.")

    # Purana task hatayein agar koi hai
    if chat_id in roasting_tasks:
        roasting_tasks[chat_id].schedule_removal()

    # Naya job jo turant start ho (first=0)
    new_job = context.job_queue.run_repeating(
        roasting_loop, 
        interval=50, 
        first=0, # Isse pehla roast turant jayega
        chat_id=chat_id, 
        data={'target': target_user}
    )
    
    roasting_tasks[chat_id] = new_job

async def stop_roast(update: Update, context: ContextTypes.DEFAULT_TYPE):
    chat_id = update.effective_chat.id
    if chat_id in roasting_tasks:
        roasting_tasks[chat_id].schedule_removal()
        del roasting_tasks[chat_id]
        await update.message.reply_text("Theek hai, thoda saans lene do usse. Roasting stopped. ✅")
    else:
        await update.message.reply_text("Abhi toh koi roasting ho hi nahi rahi.")

def main():
    Thread(target=run_flask).start()

    bot_app = ApplicationBuilder().token(TOKEN).build()
    
    # Handlers
    bot_app.add_handler(CommandHandler("start", start_command))
    bot_app.add_handler(CommandHandler("roast", start_roast))
    bot_app.add_handler(CommandHandler("stop", stop_roast))
    
    print("Bot is running...")
    bot_app.run_polling()

if __name__ == '__main__':
    main()
