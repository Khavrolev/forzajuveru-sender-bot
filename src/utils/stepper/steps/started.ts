import { bot } from "../../../bot/telegram";
import { store } from "../../../store/store";
import { ContentStatus, StepAction } from "../../../types/stepper";
import { deleteKeyboardByDefault } from "../../telegram";

export const onStartedStep = (chatId: number) => {
  store[chatId].status = ContentStatus.NEWS;

  bot.sendMessage(chatId, "Введи текст новости", deleteKeyboardByDefault);

  return StepAction.NEXT;
};
