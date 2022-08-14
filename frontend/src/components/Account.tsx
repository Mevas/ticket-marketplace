import React from "react";
import {
  useAccount,
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
} from "wagmi";
import { Box } from "./Box";
import { useTicketContract } from "../hooks/use-ticket-contract";
import { useBalance } from "../hooks/use-balance";
import { CryptoTicketABI } from "../utils/hardhat";
import { Button } from "./Button";
import { useTickets } from "../hooks/use-tickets";

export const Account = () => {
  const account = useAccount();
  const contract = useTicketContract();
  const { getBalance } = useBalance();

  const { config } = usePrepareContractWrite({
    addressOrName: contract.address,
    contractInterface: CryptoTicketABI.abi,
    functionName: "safeMint",
    args: [account.address, 5],
  });
  const { write, data, isLoading: isTransacting } = useContractWrite(config);
  const { isLoading } = useWaitForTransaction({
    hash: data?.hash,
    wait: data?.wait,
    onSuccess: async () => {
      await data?.wait();
      await getBalance();
    },
  });

  const tickets = useTickets();

  return (
    <Box>
      <Button
        disabled={!write}
        onClick={() => write?.()}
        loading={
          isTransacting ? "Transacting..." : isLoading ? "Minting..." : false
        }
      >
        Mint
      </Button>

      <Button
        onClick={async () => {
          // const test = await contract.testView();
          // console.log(test);
        }}
      >
        Test view
      </Button>

      <div style={{ display: "flex", gap: 10 }}>
        {tickets?.map((ticket, index) => (
          <div key={index}>{ticket.number}</div>
        ))}
      </div>
    </Box>
  );
};
