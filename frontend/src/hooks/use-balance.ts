import { BigNumberish } from "ethers";
import { useRecoilState } from "recoil";
import { useTicketContract } from "./use-ticket-contract";
import { balanceState } from "../recoil/atoms/balance";
import { useAccount, useSigner } from "wagmi";
import { useCallback, useMemo } from "react";

export const useBalance = () => {
  const contract = useTicketContract();
  const [balance, setBalance] = useRecoilState(balanceState);
  const { data: account } = useAccount();
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
      const balance = (await connection.totalSupply(id)).toNumber();

      setBalance((balances) => ({
        ...balances,
        [id.toString()]: balance,
      }));
    },
    [account?.address, contract, setBalance, signer]
  );

  return useMemo(() => ({ balance, getBalance }), [balance, getBalance]);
};
