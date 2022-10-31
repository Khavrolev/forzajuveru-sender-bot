import { bot } from "../../../bot/telegram";
import { store } from "../../../store/store";
import { ContentStatus, StepAction } from "../../../types/stepper";

export const onStartedStep = (chatId: number) => {
  store[chatId].status = ContentStatus.NEWS;

  bot.sendMessage(chatId, "Введи текст новости");

  return StepAction.NEXT;
};
