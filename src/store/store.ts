import { ContentStatus } from "../types/stepper";

interface Store {
  status: ContentStatus;
  step: number;
  message: string | null;
  image: string | null;
}

const defaultStore: Store = {
  status: ContentStatus.NOTHING,
  step: 0,
  message: null,
  image: null
};
export const setDefaultStore = () => (store = { ...defaultStore });
export let store: Store = setDefaultStore();
