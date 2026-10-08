import AsyncStorage from "@react-native-async-storage/async-storage";
import { repository } from "./repository";
export const createRepository = (environment: string) =>
  repository(AsyncStorage, environment);
