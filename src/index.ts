import dotenv from "dotenv";
dotenv.config();

import { bot } from "./bot/bot";
import callbackOnText from "./bot/text";

bot.on("text", callbackOnText);
