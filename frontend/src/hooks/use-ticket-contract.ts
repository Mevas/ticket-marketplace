import { useContract, useSigner } from "wagmi";
import { Ticket } from "../hardhat/typechain-types";
import contractAddresses from "../contracts/contract-address.json";
import TicketABI from "../contracts/Ticket.json";

export const useTicketContract = () => {
  const { data: signer } = useSigner();

  return useContract<Ticket>({
    addressOrName: contractAddresses.Ticket,
    contractInterface: TicketABI.abi,
    signerOrProvider: signer,
  });
};
