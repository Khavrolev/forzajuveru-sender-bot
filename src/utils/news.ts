import { addDays, getUnixTime, isValid, parse } from "date-fns";
import { Message } from "node-telegram-bot-api";
import { bot } from "../bot/telegram";
import { setDefaultStore, store } from "../store/store";
import { NewsStepper, ContentStatus } from "../types/stepper";
import { publishNews } from "./publish";

export const publishNewsInProcess = async (message: Message) => {
  const text = message.text;
  const photo = message.photo;
  const chatId = message.chat.id;

  switch (store[chatId].step) {
    case NewsStepper.STARTED:
      store[chatId].status = ContentStatus.NEWS;
      store[chatId].step = store[chatId].step + 1;

      bot.sendMessage(chatId, "Введи текст новости");
      break;
    case NewsStepper.TEXT:
      if (!text) {
        bot.sendMessage(chatId, "Текст новости не введён. Введи текст новости");
        break;
      }

      store[chatId].message = text;
      store[chatId].step = store[chatId].step + 1;

      bot.sendMessage(chatId, "Пришли картинку");
      break;
    case NewsStepper.IMAGE:
      if (!photo || photo.length === 0) {
        bot.sendMessage(chatId, "Картинка не прислана. Пришли картинку");
        break;
      }

      store[chatId].image = photo.reduce((biggest, current) => {
        if (
          biggest.file_size && current.file_size
            ? biggest?.file_size > current.file_size
            : biggest.width > current.width
        ) {
          return biggest;
        }

        return current;
      }, photo[photo.length - 1]).file_id;
      store[chatId].step = store[chatId].step + 1;

      bot.sendMessage(
        chatId,
        'Введи таймер для новости или напиши "Нет" для немедленной публикации',
        {
          reply_markup: {
            one_time_keyboard: true,
            keyboard: [[{ text: "Нет" }]]
          }
        }
      );
      break;
    case NewsStepper.TIMER:
      if (text === "Нет") {
        store[chatId].publishDate = null;
      } else {
        const now = new Date();
        const date = text && parse(text, "kk:mm", now);

        if (!date || !isValid(date)) {
          bot.sendMessage(chatId, "Дата введена некорректно");
          break;
        }

        store[chatId].publishDate =
          getUnixTime(date) - getUnixTime(now) > 0
            ? getUnixTime(date)
            : getUnixTime(addDays(date, 1));
      }

      store[chatId].step = store[chatId].step + 1;

      bot.sendMessage(
        chatId,
        'Напиши "Да", чтобы опубликовать новость в Telegram и VK. Любое другое сообщение отменит публикацию',
        {
          reply_markup: {
            one_time_keyboard: true,
            keyboard: [[{ text: "Да" }], [{ text: "Нет" }]]
          }
        }
      );
      break;
    case NewsStepper.FINISHED:
      if (text === "Да") {
        await publishNews(chatId);
      } else {
        bot.sendMessage(chatId, "Новость не опубликована! Начните с начала");
      }

      setDefaultStore(chatId);
      break;
  }
};
