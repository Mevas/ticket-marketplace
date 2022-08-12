import { BigNumberish } from "ethers";
import { useQuery } from "react-query";
import { useTicketContract } from "./use-ticket-contract";
import { useSigner } from "wagmi";
import { axiosInstance } from "../utils/auth";

export const useTicket = (id: BigNumberish) => {
  const contract = useTicketContract();
  const { data: signer } = useSigner();

  return useQuery(
    ["ticket"],
    async () => {
      return (await axiosInstance.get(await contract.tokenURI(id))).data;
    },
    {
      enabled: !!signer,
    }
  );
};
