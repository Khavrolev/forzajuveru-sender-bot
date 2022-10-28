import { Message } from "node-telegram-bot-api";
import { publishNewsCommand, stopPublishingCommand } from "../const/commands";
import { availableChats, targetChannel } from "../const/telegram";
import { targetGroup } from "../const/vk";
import { setDefaultStore, store } from "../store/store";
import { PublicationStatus } from "../types/stepper";
import { publishNewsInProcess } from "../utils/news";
import { bot } from "./telegram";
import { vk } from "./vk";

const callbackOnText = (message: Message) => {
  const text = message.text;
  const chatId = message.chat.id;

  // if (!text) {
  //   return;
  // }

  if (!availableChats.includes(chatId)) {
    return bot.sendMessage(
      chatId,
      "Из данного чата посылать сообщения боту запрещено"
    );
  }

  if (text === stopPublishingCommand) {
    setDefaultStore();
    return bot.sendMessage(
      chatId,
      "Публикация прекращена. Если нужно, начните заново"
    );
  }

  if (text === publishNewsCommand || store.status === PublicationStatus.NEWS) {
    return publishNewsInProcess();
  }

  // vk.wall.post({ owner_id: targetGroup, from_group: 1, message: text });
  // bot.sendMessage(targetChannel, text);
};

export default callbackOnText;
