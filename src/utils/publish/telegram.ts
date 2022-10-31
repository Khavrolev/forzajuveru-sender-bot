import { bot } from "../../bot/telegram";
import { targetChannel } from "../../const/telegram";
import { deleteKeyboardByDefault } from "../telegram";

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

export const publishNewsToTelegram = async (
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
