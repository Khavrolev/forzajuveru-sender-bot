import { bot } from "../../../bot/telegram";
import { publishNews } from "../../publish/publish";
import { deleteKeyboardByDefault } from "../../telegram";

export const onFinishedStep = async (chatId: number, text?: string) => {
  if (text === "Да") {
    return await publishNews(chatId);
  }

  bot.sendMessage(
    chatId,
    "Новость не опубликована! Начните с начала",
    deleteKeyboardByDefault
  );
};
