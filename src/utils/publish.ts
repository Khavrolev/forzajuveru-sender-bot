import { bot } from "../bot/telegram";
import { vkApi, vkUpload } from "../bot/vk";
import { targetChannel } from "../const/telegram";
import { targetGroup } from "../const/vk";
import { store } from "../store/store";
import { PublicationStatus } from "../types/stepper";

const sendPhotoWithBigText = async (message: string, image?: string) => {
  const text = image ? `<a href="${image}">&#8205;</a>${message}` : message;

  await bot.sendMessage(targetChannel, text, {
    parse_mode: "HTML"
  });
};

export const publishNews = async (chatId: number) => {
  if (!store.message) {
    bot.sendMessage(chatId, "Невозможно опубликовать пустую новость");

    return PublicationStatus.ERROR;
  }
  if (!store.image) {
    bot.sendMessage(chatId, "Невозможно опубликовать новость без фотографии");

    return PublicationStatus.ERROR;
  }

  try {
    const urlImg = await bot.getFileLink(store.image);
    const attachment = await vkUpload.wallPhoto({ source: { value: urlImg } });

    await Promise.all([
      vkApi.wall.post({
        owner_id: targetGroup,
        from_group: 1,
        message: store.message,
        attachment
      }),
      store.message.length > 1024
        ? sendPhotoWithBigText(store.message, attachment.largeSizeUrl)
        : bot.sendPhoto(targetChannel, store.image, { caption: store.message })
    ]);

    return PublicationStatus.PUBLISHED;
  } catch (error) {
    console.log(error);
    bot.sendMessage(
      chatId,
      "Произошла какая-то ошибка, новость не опубликована"
    );

    return PublicationStatus.ERROR;
  }
};
