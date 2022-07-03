import { atom } from "recoil";

export const balanceState = atom<Record<number, number>>({
  key: "balanceState",
  default: {},
});
