import React, { useEffect } from "react";
import { Button, Text } from "@nextui-org/react";
import {
  useAccount,
  useConnect,
  useContract,
  useDisconnect,
  useEnsAvatar,
  useEnsName,
  useSigner,
} from "wagmi";
import { Box } from "./Box";

import contractAddresses from "../src/contracts/contract-address.json";
import TicketABI from "../src/contracts/Ticket.json";
import { Ticket } from "../src/hardhat/typechain-types";

export const Account = () => {
  const { data: account } = useAccount();
  const { data: ensAvatar } = useEnsAvatar({ addressOrName: account?.address });
  const { data: ensName } = useEnsName({ address: account?.address });
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();
  const { data: signer } = useSigner();
  const contract = useContract<Ticket>({
    addressOrName: contractAddresses.Ticket,
    contractInterface: TicketABI.abi,
    signerOrProvider: signer,
  });
  console.log(contract);

  useEffect(() => {
    (async () => {
      if (!account || !account.address || !signer) {
        return;
      }

      const connection = await contract.connect(account.address);
      console.log(await connection.count());
    })();
  }, [account, contract, signer]);

  // useEffect(() => {
  //   // if (!signer || !account.address) {
  //   //   return;
  //   // }
  //
  //   contract.balanceOf(account.address).then((r) => console.log(r));
  // }, [contract]);

  if (!account?.address) {
    return (
      <Button onClick={() => connect(connectors[0])}>Connect MetaMask</Button>
    );
  }
  // contract.balanceOf(account.address).then((r) => console.log(r));

  const address = account.address;

  return (
    <Box>
      <Box
        css={{
          background: "$accents1",
          p: "$sm",
          borderRadius: "$md",
        }}
      >
        {ensAvatar && <img src={ensAvatar} alt="ENS Avatar" />}
        <Text>{ensName ? `${ensName} (${address})` : address}</Text>
        <Text>Connected to {account.connector?.name}</Text>
        <Button onClick={() => disconnect()}>Disconnect</Button>
      </Box>

      <Button onClick={async () => contract.safeMint(address)}>Mint</Button>

      {}
    </Box>
  );
};
