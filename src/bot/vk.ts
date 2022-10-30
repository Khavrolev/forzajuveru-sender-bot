import { API, Upload } from "vk-io";

export const vkApi = new API({
  token: process.env.VK_TOKEN as string
});

export const vkUpload = new Upload({
  api: vkApi
});
