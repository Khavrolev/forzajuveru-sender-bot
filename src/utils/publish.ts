import { bot } from "../bot/telegram";
import { vk } from "../bot/vk";
import { targetChannel } from "../const/telegram";
import { targetGroup } from "../const/vk";
import { store } from "../store/store";
import { PublicationStatus } from "../types/stepper";

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
    await Promise.all([
      vk.wall.post({
        owner_id: targetGroup,
        from_group: 1,
        message: store.message
      }),
      bot.sendMessage(targetChannel, store.message)
      // bot.sendPhoto(targetChannel, store.image, { caption: store.message })
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
