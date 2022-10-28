import { Message } from "node-telegram-bot-api";
import { bot } from "../bot/telegram";
import { setDefaultStore, store } from "../store/store";
import { NewsStepper, PublicationStatus } from "../types/stepper";

export const publishNewsInProcess = (message: Message) => {
  const chatId = message.chat.id;

  switch (store.step) {
    case NewsStepper.STARTED:
      bot.sendMessage(chatId, "Введи текст новости");
      store.status = PublicationStatus.NEWS;
      store.step = store.step + 1;
      break;
    case NewsStepper.TEXT:
      bot.sendMessage(chatId, "Пришли картинку");
      store.step = store.step + 1;
      break;
    case NewsStepper.IMAGE:
      bot.sendMessage(
        chatId,
        'Напиши "Да", чтобы опубликовать новость в Telegram и VK. Любое другое сообщение отменит публикацию'
      );
      store.step = store.step + 1;
      break;
    case NewsStepper.FINISHED:
      bot.sendMessage(chatId, "Новость опубликована!");
      setDefaultStore();
      break;
  }
};
