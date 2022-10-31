import { addDays, getUnixTime, isValid, parse } from "date-fns";
import { bot } from "../../../bot/telegram";
import { store } from "../../../store/store";
import { StepAction } from "../../../types/stepper";
import { deleteKeyboardByDefault } from "../../telegram";

const gePublishTime = (text?: string) => {
  if (!text || text === "Нет") {
    return null;
  }

  return parse(text, "kk:mm", new Date());
};

const convertDateToCorrectUnixTime = (date: Date | null) => {
  if (!date) {
    return null;
  }

  if (getUnixTime(date) - getUnixTime(new Date()) > 0) {
    return getUnixTime(date);
  }

  return getUnixTime(addDays(date, 1));
};

export const onTimerStep = (chatId: number, text?: string) => {
  const date = gePublishTime(text);

  if (date && !isValid(date)) {
    bot.sendMessage(
      chatId,
      "Время введено некорректно",
      deleteKeyboardByDefault
    );
    return StepAction.REPEAT;
  }

  store[chatId].publishDate = convertDateToCorrectUnixTime(date);

  bot.sendMessage(
    chatId,
    'Напиши "Да", чтобы опубликовать новость в Telegram и VK. Любое другое сообщение отменит публикацию',
    {
      reply_markup: {
        keyboard: [[{ text: "Да" }], [{ text: "Нет" }]]
      }
    }
  );

  return StepAction.NEXT;
};
