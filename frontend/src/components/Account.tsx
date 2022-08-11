import React, { useState } from "react";
import { Button, Loading } from "@nextui-org/react";
import { useAccount } from "wagmi";
import { Box } from "./Box";
import { useTicketContract } from "../hooks/use-ticket-contract";
import { useBalance } from "../hooks/use-balance";
import { useTicket } from "../hooks/use-ticket";
import { AuthButton } from "./AuthButton";

export const Account = () => {
  const account = useAccount();
  const contract = useTicketContract();
  const { balance, getBalance } = useBalance();

  const [loading, setLoading] = useState<boolean | string>(false);

  const { data: ticket } = useTicket(1);
  console.log(ticket);

  if (loading) {
    return <Loading size="xl">{loading}</Loading>;
  }

  if (!account.address) {
    return null;
  }

  const address = account.address;

  return (
    <Box>
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
