import { PublicationStatus } from "../types/stepper";

interface Store {
  status: PublicationStatus;
  message: string | null;
}

const defaultStore: Store = {
  status: PublicationStatus.NOTHING,
  message: null
};
export const setDefaultStore = () => (store = defaultStore);
export let store: Store = setDefaultStore();
