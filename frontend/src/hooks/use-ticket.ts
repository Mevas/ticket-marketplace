import { BigNumberish, utils } from "ethers";
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
      return (
        await axiosInstance.get(
          (
            await contract.uri(id)
          ).replace(
            "{id}",
            utils.hexZeroPad(utils.hexlify(314592), 32).slice(2)
          )
        )
      ).data;
    },
    {
      enabled: !!signer,
    }
  );
};
