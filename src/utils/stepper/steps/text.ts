import { bot } from "../../../bot/telegram";
import { store } from "../../../store/store";
import { StepAction } from "../../../types/stepper";
import { deleteKeyboardByDefault } from "../../telegram";

export const onTextStep = (chatId: number, text?: string) => {
  if (!text) {
    bot.sendMessage(
      chatId,
      "Текст новости не введён. Введи текст новости",
      deleteKeyboardByDefault
    );
    return StepAction.REPEAT;
  }

  store[chatId].message = text;

  bot.sendMessage(chatId, "Пришли картинку", deleteKeyboardByDefault);

  return StepAction.NEXT;
};
