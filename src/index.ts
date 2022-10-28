import dotenv from "dotenv";
dotenv.config();

import { bot } from "./bot/bot";
import callbackOnText from "./bot/callback";
import {
  backToThePreviousStep,
  publishNews,
  stopPublishing
} from "./const/commands";

bot.setMyCommands([
  { command: publishNews, description: "Опубликовать новость" },
  {
    command: backToThePreviousStep,
    description: "Вернуться на предыдущий шаг"
  },
  { command: stopPublishing, description: "Сбросить публикацию" }
]);

bot.on("text", callbackOnText);
