import { Message } from "node-telegram-bot-api";
import { availableChats, targetChannel } from "../const/chat";
import { bot } from "./bot";

const callbackOnText = (message: Message) => {
  const text = message.text;
  const chatId = message.chat.id;

  if (!text) {
    return;
  }

  if (!availableChats.includes(chatId)) {
    return bot.sendMessage(
      chatId,
      "Из данного чата посылать сообщения запрещено"
    );
  }

  bot.sendMessage(targetChannel, text);
};

export default callbackOnText;
