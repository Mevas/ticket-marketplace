import React from "react";
import { useAccount, useEnsName } from "wagmi";
import { formatWallet } from "../utils/formatting";

export const EnsName = () => {
  const account = useAccount();
  const { data: ensName } = useEnsName({ address: account?.address });

  return <>{ensName ?? (account.address && formatWallet(account.address))}</>;
};
