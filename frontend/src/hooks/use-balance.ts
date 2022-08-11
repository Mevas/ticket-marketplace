import { BigNumberish } from "ethers";
import { useRecoilState } from "recoil";
import { useTicketContract } from "./use-ticket-contract";
import { balanceState } from "../recoil/atoms/balance";
import { useAccount, useSigner } from "wagmi";
import { useCallback, useEffect, useMemo } from "react";

export const useBalance = () => {
  const contract = useTicketContract();
  const [balance, setBalance] = useRecoilState(balanceState);
  const account = useAccount();
  const { data: signer } = useSigner();

  const getBalance = useCallback(
    async (id: BigNumberish) => {
      if (!account?.address) {
        console.error("No account address!");
        return;
      }

      if (!signer) {
        console.error("No signer!");
        return;
      }

      const connection = await contract.connect(account.address);
      const balance = (
        await connection.balanceOf(account.address, id)
      ).toNumber();

      setBalance((balances) => ({
        ...balances,
        [id.toString()]: balance,
      }));
    },
    [account?.address, contract, setBalance, signer]
  );

  useEffect(() => {
    if (!signer) {
      return;
    }

    (async () =>
      await Promise.all([1, 2].map(async (id) => await getBalance(id))))();
  }, [signer]);

  return useMemo(() => ({ balance, getBalance }), [balance, getBalance]);
};
