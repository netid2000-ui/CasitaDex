import AsyncStorage from "@react-native-async-storage/async-storage";
import { repository } from "./repository";
import type { DraftStore } from "./draft-types";
export const createRepository = (environment: string) => ({
  ...repository(AsyncStorage, environment),
  drafts: undefined as DraftStore | undefined,
});

