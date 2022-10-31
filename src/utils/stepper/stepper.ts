import { addDays, getUnixTime, isValid, parse } from "date-fns";
import { Message } from "node-telegram-bot-api";
import { bot } from "../../bot/telegram";
import { setDefaultStore, store } from "../../store/store";
import { NewsStepper, ContentStatus } from "../../types/stepper";
import { publishNews } from "../publish/publish";
import { controlStep } from "../telegram";
import { onFinishedStep } from "./steps/finished";
import { onImageStep } from "./steps/image";
import { onStartedStep } from "./steps/started";
import { onTextStep } from "./steps/text";
import { onTimerStep } from "./steps/timer";

export const publishNewsInProcess = async (message: Message) => {
  const text = message.text;
  const photo = message.photo;
  const chatId = message.chat.id;

  switch (store[chatId].step) {
    case NewsStepper.STARTED:
      const actionStarted = onStartedStep(chatId);
      controlStep(chatId, actionStarted);

      break;
    case NewsStepper.TEXT:
      const actionText = onTextStep(chatId, text);
      controlStep(chatId, actionText);

      break;
    case NewsStepper.IMAGE:
      const actionImage = onImageStep(chatId, photo);
      controlStep(chatId, actionImage);

      break;
    case NewsStepper.TIMER:
      const actionTimer = onTimerStep(chatId, text);
      controlStep(chatId, actionTimer);

      break;
    case NewsStepper.FINISHED:
      await onFinishedStep(chatId, text);
      setDefaultStore(chatId);

      break;
  }
};
