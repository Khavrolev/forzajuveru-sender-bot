import { botName } from "../const/telegram";
import { store } from "../store/store";
import { StepAction } from "../types/stepper";

export const deleteKeyboardByDefault = {
  reply_markup: { remove_keyboard: true }
};

export const isTextMatchesCommand = (command: string, text?: string) =>
  text && [command, `${command}@${botName}`].includes(text);

export const controlStep = (chatId: number, action: StepAction) => {
  if (action === StepAction.NEXT) {
    store[chatId].step = store[chatId].step + 1;
  }
};
