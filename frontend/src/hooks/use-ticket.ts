import { BigNumberish, utils } from "ethers";
import { useQuery } from "react-query";
import axios from "axios";
import { useTicketContract } from "./use-ticket-contract";
import { useSigner } from "wagmi";

export const useTicket = (id: BigNumberish) => {
  const contract = useTicketContract();
  const { data: signer } = useSigner();

  return useQuery(
    ["ticket"],
    async () => {
      return (
        await axios.get(
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
