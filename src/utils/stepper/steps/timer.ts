import { addDays, getUnixTime, isValid, parse } from "date-fns";
import { bot } from "../../../bot/telegram";
import { store } from "../../../store/store";
import { StepAction } from "../../../types/stepper";

export const onTimerStep = (chatId: number, text?: string) => {
  if (text === "Нет") {
    store[chatId].publishDate = null;
    return StepAction.REPEAT;
  }

  const now = new Date();
  const date = text && parse(text, "kk:mm", now);

  if (!date || !isValid(date)) {
    bot.sendMessage(chatId, "Дата введена некорректно");
    return StepAction.REPEAT;
  }

  store[chatId].publishDate =
    getUnixTime(date) - getUnixTime(now) > 0
      ? getUnixTime(date)
      : getUnixTime(addDays(date, 1));

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

  return StepAction.NEXT;
};
