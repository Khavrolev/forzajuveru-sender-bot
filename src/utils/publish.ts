import { PhotoAttachment } from "vk-io";
import { bot } from "../bot/telegram";
import { vkApi, vkUpload } from "../bot/vk";
import { targetChannel } from "../const/telegram";
import { targetGroup } from "../const/vk";
import { store } from "../store/store";

const MAX_LENGTH_FOR_PHOTO_WITH_CAPTION_IN_TELEGRAM = 1024;

const sendPhotoWithBigTextToTelegram = async (
  message: string,
  image?: string
) => {
  const text = image ? `<a href="${image}">&#8205;</a>${message}` : message;

  await bot.sendMessage(targetChannel, text, {
    parse_mode: "HTML"
  });
};

const publishNewsToTelegram = async (
  message: string,
  imageFromTelegram: string,
  imageFromVK?: string
) => {
  if (message.length > MAX_LENGTH_FOR_PHOTO_WITH_CAPTION_IN_TELEGRAM) {
    return sendPhotoWithBigTextToTelegram(message, imageFromVK);
  }

  bot.sendPhoto(targetChannel, imageFromTelegram, {
    caption: message
  });
};

const publishNewsToVK = async (
  message: string,
  attachment: PhotoAttachment
) => {
  vkApi.wall.post({
    owner_id: targetGroup,
    from_group: 1,
    message,
    attachment
  });
};

export const publishNews = async (chatId: number) => {
  const { message, image } = store[chatId];

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
      publishNewsToVK(message, attachment),
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
