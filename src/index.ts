import dotenv from "dotenv";
dotenv.config();

import { bot } from "./bot/telegram";
import callbackOnText from "./bot/callback";
import { publishNewsCommand, stopPublishingCommand } from "./const/commands";

bot.setMyCommands([
  { command: publishNewsCommand, description: "Опубликовать новость" },
  { command: stopPublishingCommand, description: "Сбросить публикацию" }
]);

bot.on("message", callbackOnText);
