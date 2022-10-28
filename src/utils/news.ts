import { Message } from "node-telegram-bot-api";
import { bot } from "../bot/telegram";
import { setDefaultStore, store } from "../store/store";
import {
  NewsStepper,
  PublicationStatus,
  ContentStatus
} from "../types/stepper";
import { publishNews } from "./publish";

export const publishNewsInProcess = async (message: Message) => {
  const text = message.text;
  const photo = message.photo;
  const chatId = message.chat.id;

  switch (store.step) {
    case NewsStepper.STARTED:
      store.status = ContentStatus.NEWS;
      store.step = store.step + 1;

      bot.sendMessage(chatId, "Введи текст новости");
      break;
    case NewsStepper.TEXT:
      if (!text) {
        bot.sendMessage(chatId, "Текст новости не введён. Введи текст новости");
        break;
      }

      store.message = text;
      store.step = store.step + 1;

      bot.sendMessage(chatId, "Пришли картинку");
      break;
    case NewsStepper.IMAGE:
      if (!photo || photo.length === 0) {
        bot.sendMessage(chatId, "Картинка не прислана. Пришли картинку");
        break;
      }

      store.image = photo.reduce((biggest, current) => {
        if (
          biggest.file_size && current.file_size
            ? biggest?.file_size > current.file_size
            : biggest.width > current.width
        ) {
          return biggest;
        }

        return current;
      }, photo[photo.length - 1]).file_id;
      store.step = store.step + 1;

      bot.sendMessage(
        chatId,
        'Напиши "Да", чтобы опубликовать новость в Telegram и VK. Любое другое сообщение отменит публикацию'
      );
      break;
    case NewsStepper.FINISHED:
      if (text === "Да") {
        const publicationStatus = await publishNews(chatId);
        publicationStatus === PublicationStatus.PUBLISHED &&
          bot.sendMessage(
            chatId,
            "Новость опубликована! Проверь Telegram и VK"
          );
      } else {
        bot.sendMessage(chatId, "Новость не опубликована! Начните с начала");
      }

      setDefaultStore();
      break;
  }
};
