import { PublicationStatus } from "../types/stepper";

interface Store {
  status: PublicationStatus;
  step: number;
  message: string | null;
}

const defaultStore: Store = {
  status: PublicationStatus.NOTHING,
  step: 0,
  message: null
};
export const setDefaultStore = () => (store = defaultStore);
export let store: Store = setDefaultStore();
