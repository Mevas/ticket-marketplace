import React from "react";
import {
  useAccount,
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
} from "wagmi";
import { Box } from "./Box";
import { useTicketContract } from "../hooks/use-ticket-contract";
import { CryptoTicketABI } from "../utils/hardhat";
import { Button } from "./Button";
import { useRouter } from "next/router";
import { useQueryClient } from "react-query";
import { AdminEvent } from "../types";
import { useForm } from "react-hook-form";
import { Form } from "./forms/Form";
import { FormInput } from "./forms/FormInput";

export const Account = () => {
  const account = useAccount();
  const contract = useTicketContract();
  const router = useRouter();
  const { id } = router.query;
  const queryClient = useQueryClient();

  const methods = useForm<{ quantity: number }>({
    defaultValues: {
      quantity: 5,
    },
  });
  const { watch } = methods;
  const quantity = +watch("quantity");

  const { config } = usePrepareContractWrite({
    addressOrName: contract.address,
    contractInterface: CryptoTicketABI.abi,
    functionName: "safeMintForEvent",
    args: [account.address, quantity, +id!],
    enabled: typeof id !== "undefined",
  });
  const { write, data, isLoading: isTransacting } = useContractWrite(config);
  const { isLoading } = useWaitForTransaction({
    hash: data?.hash,
    wait: data?.wait,
    onSuccess: async () => {
      await data?.wait();
      queryClient.setQueryData<AdminEvent>([`events/${id}`], (oldEvent) => {
        if (!oldEvent) {
          return;
        }

        return {
          ...oldEvent,
          ticketCount: oldEvent.ticketCount + quantity,
        };
      });
    },
  });

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

      <Form methods={methods}>
        <FormInput label="Quantity" name="quantity" type="number" />
      </Form>

      <Button
        onClick={async () => {
          // const test = await contract.testView();
          // console.log(test);
        }}
      >
        Test view
      </Button>

      <div style={{ display: "flex", gap: 10 }}>
        {/*{tickets?.map((ticket, index) => (*/}
        {/*  <div key={index}>{ticket.id}</div>*/}
        {/*))}*/}
      </div>
    </Box>
  );
};
