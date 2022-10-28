import { Message } from "node-telegram-bot-api";
import {
  publishNewsCommand,
  startCommand,
  stopPublishingCommand
} from "../const/commands";
import { availableChats, targetChannel } from "../const/telegram";
import { targetGroup } from "../const/vk";
import { setDefaultStore, store } from "../store/store";
import { PublicationStatus } from "../types/stepper";
import { publishNewsInProcess } from "../utils/news";
import { bot } from "./telegram";
import { vk } from "./vk";

const callbackOnText = (message: Message) => {
  // console.log(message);
  const text = message.text;
  const chatId = message.chat.id;

  if (text === startCommand) {
    return bot.sendMessage(
      chatId,
      "Привет, дорогой друг! Посылка сообщений доступна только в специальной группе, удостоверься, что ты пишешь в ней"
    );
  }

  // if (!availableChats.includes(chatId)) {
  //   return bot.sendMessage(
  //     chatId,
  //     "Из данного чата посылать сообщения боту запрещено"
  //   );
  // }

  if (text === stopPublishingCommand) {
    setDefaultStore();
    return bot.sendMessage(
      chatId,
      "Публикация прекращена. Если нужно, начните заново"
    );
  }
  console.log(store.status);
  if (
    (text === publishNewsCommand &&
      store.status === PublicationStatus.NOTHING) ||
    store.status === PublicationStatus.NEWS
  ) {
    return publishNewsInProcess(message);
  }

  bot.sendMessage(chatId, "Привет, дорогой друг! Команда не распознана");

  // vk.wall.post({ owner_id: targetGroup, from_group: 1, message: text });
  // bot.sendMessage(targetChannel, text);
};

export default callbackOnText;
