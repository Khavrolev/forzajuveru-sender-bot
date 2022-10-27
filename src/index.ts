import { bot } from "./bot/bot";
import callbackOnText from "./bot/text";

bot.on("text", callbackOnText);
