import React from "react";
import { Button, Text } from "@nextui-org/react";
import {
  useAccount,
  useConnect,
  useDisconnect,
  useEnsAvatar,
  useEnsName,
} from "wagmi";
import { Box } from "./Box";

export const Account = () => {
  const { data: account } = useAccount();
  const { data: ensAvatar } = useEnsAvatar({ addressOrName: account?.address });
  const { data: ensName } = useEnsName({ address: account?.address });
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();

  return (
    <Box>
      {account ? (
        <Box
          css={{
            background: "$accents1",
            p: "$sm",
            borderRadius: "$md",
          }}
        >
          {ensAvatar && <img src={ensAvatar} alt="ENS Avatar" />}
          <Text>
            {ensName ? `${ensName} (${account.address})` : account.address}
          </Text>
          <Text>Connected to {account.connector?.name}</Text>
          <Button onClick={() => disconnect()}>Disconnect</Button>
        </Box>
      ) : (
        <Button onClick={() => connect(connectors[0])}>Connect MetaMask</Button>
      )}
    </Box>
  );
};
