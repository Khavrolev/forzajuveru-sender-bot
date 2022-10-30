import { botName } from "../const/telegram";

export const isTextMatchesCommand = (command: string, text?: string) =>
  text && [command, `${command}@${botName}`].includes(text);
