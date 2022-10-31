import { PhotoAttachment } from "vk-io";
import { vkApi } from "../../bot/vk";
import { targetGroup } from "../../const/vk";

export const publishNewsToVK = async (
  message: string,
  attachment: PhotoAttachment,
  publish_date?: number | null
) => {
  vkApi.wall.post({
    owner_id: targetGroup,
    from_group: 1,
    message,
    attachment,
    publish_date: publish_date ? publish_date : undefined
  });
};
