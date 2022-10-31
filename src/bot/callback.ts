import { Message } from "node-telegram-bot-api";
import {
  publishNewsCommand,
  startCommand,
  stopPublishingCommand
} from "../const/commands";
import { setDefaultStore, store } from "../store/store";
import { ContentStatus } from "../types/stepper";
import { publishNewsInProcess } from "../utils/news";
import { isTextMatchesCommand } from "../utils/telegram";
import { bot } from "./telegram";

const callbackOnText = (message: Message) => {
  const text = message.text;
  const chatId = message.chat.id;

  if (isTextMatchesCommand(startCommand, text)) {
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

  if (!store[chatId]) {
    setDefaultStore(chatId);
  }

  if (isTextMatchesCommand(stopPublishingCommand, text)) {
    setDefaultStore(chatId);
    return bot.sendMessage(
      chatId,
      "Публикация прекращена. Если нужно, начните заново"
    );
  }

  if (
    (isTextMatchesCommand(publishNewsCommand, text) &&
      store[chatId].status === ContentStatus.NOTHING) ||
    store[chatId].status === ContentStatus.NEWS
  ) {
    return publishNewsInProcess(message);
  }

  bot.sendMessage(chatId, "Команда не распознана");
};

export default callbackOnText;
