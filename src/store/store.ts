import { ContentStatus, NewsStepper } from "../types/stepper";

interface Store {
  status: ContentStatus;
  step: number;
  message: string | null;
  image: string | null;
  publishDate: number | null;
}

const defaultStore: Store = {
  status: ContentStatus.NOTHING,
  step: NewsStepper.STARTED,
  message: null,
  image: null,
  publishDate: null
};
export const setDefaultStore = (chatId: number) =>
  (store[chatId] = { ...defaultStore });
export let store: Record<number, Store> = {};
