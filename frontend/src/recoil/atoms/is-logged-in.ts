import { atom } from "recoil";

export const isLoggedInAtom = atom<boolean>({
  key: "isLoggedIn",
  default: false,
});
