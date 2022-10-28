import { Message } from "node-telegram-bot-api";
import {
  publishNewsCommand,
  startCommand,
  stopPublishingCommand
} from "../const/commands";
import { availableChats, targetChannel } from "../const/telegram";
import { targetGroup } from "../const/vk";
import { setDefaultStore, store } from "../store/store";
import { ContentStatus } from "../types/stepper";
import { publishNewsInProcess } from "../utils/news";
import { bot } from "./telegram";
import { vk } from "./vk";

const callbackOnText = (message: Message) => {
  // console.log(message);
  const text = message.text;
  const chatId = message.chat.id;
  console.log(store.status);
  console.log(store.step);
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

  if (
    (text === publishNewsCommand && store.status === ContentStatus.NOTHING) ||
    store.status === ContentStatus.NEWS
  ) {
    return publishNewsInProcess(message);
  }

  bot.sendMessage(chatId, "Команда не распознана");
};

export default callbackOnText;
