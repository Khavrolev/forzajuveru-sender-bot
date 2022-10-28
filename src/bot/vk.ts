import { API } from "vk-io";

export const vk = new API({
  token: process.env.VK_TOKEN as string
});
