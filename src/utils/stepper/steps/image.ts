import { PhotoSize } from "node-telegram-bot-api";
import { bot } from "../../../bot/telegram";
import { store } from "../../../store/store";
import { StepAction } from "../../../types/stepper";
import { deleteKeyboardByDefault } from "../../telegram";

const isCurrentPhotoSmaller = (biggest: PhotoSize, current: PhotoSize) => {
  if (biggest.file_size && current.file_size) {
    return biggest.file_size > current.file_size;
  }

  return biggest.width > current.width;
};

const getIdOfBiggestImage = (photo: PhotoSize[]) => {
  const image = photo.reduce(
    (biggest, current) =>
      isCurrentPhotoSmaller(biggest, current) ? biggest : current,
    photo[photo.length - 1]
  );

  return image.file_id;
};

export const onImageStep = (chatId: number, photo?: PhotoSize[]) => {
  if (!photo || photo.length === 0) {
    bot.sendMessage(
      chatId,
      "Картинка не прислана. Пришли картинку",
      deleteKeyboardByDefault
    );
    return StepAction.REPEAT;
  }

  store[chatId].image = getIdOfBiggestImage(photo);

  bot.sendMessage(
    chatId,
    'Введи таймер для новости или напиши "Нет" для немедленной публикации',
    {
      reply_markup: {
        keyboard: [[{ text: "Нет" }]]
      }
    }
  );

  return StepAction.NEXT;
};
