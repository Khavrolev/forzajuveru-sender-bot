import dotenv from "dotenv";
import TelegramBot from "node-telegram-bot-api";
import { availableChats, targetChannel } from "./const/chat";

dotenv.config();

const bot = new TelegramBot(process.env.TELEGRAM_TOKEN as string, {
  polling: true
});

bot.on("message", (message) => {
  const text = message.text;
  const chatId = message.chat.id;

  if (!text) {
    return;
  }

  if (!availableChats.includes(chatId)) {
    return bot.sendMessage(
      message.chat.id,
      "Из данного чата посылать сообщения запрещено"
    );
  }

  bot.sendMessage(targetChannel, text);
});
