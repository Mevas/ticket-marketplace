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

  const getBalance = useCallback(async () => {
    if (!account?.address) {
      console.error("No account address!");
      return;
    }

    if (!signer) {
      console.error("No signer!");
      return;
    }

    const connection = await contract.connect(account.address);
    const balance = (await connection.balanceOf(account.address)).toNumber();

    setBalance(balance);
  }, [account?.address, contract, setBalance, signer]);

  useEffect(() => {
    if (!signer) {
      return;
    }

    getBalance();
  }, [signer]);

  return useMemo(() => ({ balance, getBalance }), [balance, getBalance]);
};
