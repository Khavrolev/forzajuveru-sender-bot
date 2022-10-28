import { Message } from "node-telegram-bot-api";
import { availableChats, targetChannel } from "../const/telegram";
import { targetGroup } from "../const/vk";
import { bot } from "./bot";
import { vk } from "./vk";

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

  vk.wall.post({ owner_id: targetGroup, from_group: 1, message: text });
  bot.sendMessage(targetChannel, text);
};

export default callbackOnText;
