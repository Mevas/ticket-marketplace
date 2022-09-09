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
import { utils } from "ethers";

export const Account = () => {
  const account = useAccount();
  const contract = useTicketContract();
  const router = useRouter();
  const { id } = router.query;
  const queryClient = useQueryClient();

  const methods = useForm<{ quantity: number; price: number }>({
    defaultValues: {
      quantity: 5,
      price: 0.1,
    },
  });
  const { watch } = methods;
  const quantity = +watch("quantity");
  const price = +watch("price");

  const { config } = usePrepareContractWrite({
    addressOrName: contract.address,
    contractInterface: CryptoTicketABI.abi,
    functionName: "safeMintForEvent",
    args: [
      account.address,
      quantity,
      +id!,
      price ? utils.parseEther(price.toString()) : null,
    ],
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
    <Box style={{ display: "grid", gap: 16 }}>
      <Form methods={methods} style={{ display: "grid", gap: 6 }}>
        <FormInput label="Quantity" name="quantity" type="number" />
        <FormInput label="Price (ETH)" name="price" type="number" />
      </Form>

      <Button
        disabled={!write}
        onClick={() => write?.()}
        loading={
          isTransacting ? "Transacting..." : isLoading ? "Minting..." : false
        }
      >
        Mint
      </Button>
    </Box>
  );
};
