import { atom } from "recoil";

export const balanceState = atom<number>({
  key: "balanceState",
  default: 0,
});
