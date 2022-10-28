import { bot } from "../bot/telegram";
import { vk } from "../bot/vk";
import { targetChannel } from "../const/telegram";
import { targetGroup } from "../const/vk";
import { store } from "../store/store";

export const publishNews = (chatId: number) => {
  if (!store.message) {
    return bot.sendMessage(chatId, "Невозможно опубликовать пустую новость");
  }

  vk.wall.post({
    owner_id: targetGroup,
    from_group: 1,
    message: store.message
  });
  bot.sendMessage(targetChannel, store.message);
};
