import React, { useState } from "react";
import { Button, Loading, Text } from "@nextui-org/react";
import {
  useAccount,
  useConnect,
  useDisconnect,
  useEnsAvatar,
  useEnsName,
} from "wagmi";
import { Box } from "./Box";
import { useTicketContract } from "../hooks/use-ticket-contract";
import { useBalance } from "../hooks/use-balance";
import { useTicket } from "../hooks/use-ticket";
import { AuthButton } from "./AuthButton";

export const Account = () => {
  const { data: account } = useAccount();
  const { data: ensAvatar } = useEnsAvatar({ addressOrName: account?.address });
  const { data: ensName } = useEnsName({ address: account?.address });
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();

  const contract = useTicketContract();
  const { balance, getBalance } = useBalance();

  const [loading, setLoading] = useState<boolean | string>(false);

  const { data: ticket } = useTicket(1);
  console.log(ticket);

  if (!account?.address) {
    return (
      <Button onClick={() => connect(connectors[0])}>Connect MetaMask</Button>
    );
  }

  if (loading) {
    return <Loading size="xl">{loading}</Loading>;
  }

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

      <Button
        onClick={async () => {
          setLoading("Transacting...");
          const test = await contract.mint(address, 1, 5, "0x00");
          setLoading("Minting...");
          await test.wait();
          await getBalance(1);
          setLoading(false);
        }}
      >
        Mint
      </Button>

      <Button
        onClick={async () => {
          const test = await contract.testView();
          console.log(test);
        }}
      >
        Test view
      </Button>

      <AuthButton />

      {Object.entries(balance).map(([id, value]) => {
        return (
          <Box key={id}>
            {id}: {value}
          </Box>
        );
      })}
    </Box>
  );
};
