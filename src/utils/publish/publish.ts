import { bot } from "../../bot/telegram";
import { vkUpload } from "../../bot/vk";
import { store } from "../../store/store";
import { publishNewsToTelegram } from "./telegram";
import { publishNewsToVK } from "./vk";

export const publishNews = async (chatId: number) => {
  const { message, image, publishDate } = store[chatId];

  if (!message) {
    return bot.sendMessage(chatId, "Невозможно опубликовать пустую новость");
  }
  if (!image) {
    return bot.sendMessage(
      chatId,
      "Невозможно опубликовать новость без фотографии"
    );
  }

  try {
    const urlImg = await bot.getFileLink(image);
    const attachment = await vkUpload.wallPhoto({ source: { value: urlImg } });

    await Promise.all([
      publishNewsToVK(message, attachment, publishDate),
      publishNewsToTelegram(message, image, attachment.largeSizeUrl)
    ]);

    bot.sendMessage(chatId, "Новость опубликована! Проверь Telegram и VK");
  } catch (error) {
    console.log(error);
    bot.sendMessage(
      chatId,
      "Произошла какая-то ошибка, новость не опубликована"
    );
  }
};
