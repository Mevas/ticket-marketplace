import { useContract, useSigner } from "wagmi";
import { CryptoTicket } from "../hardhat/typechain-types";
import { contractAddresses, CryptoTicketABI } from "../utils/hardhat";

export const useTicketContract = () => {
  const { data: signer } = useSigner();

  return useContract<CryptoTicket>({
    addressOrName: contractAddresses.CryptoTicket,
    contractInterface: CryptoTicketABI.abi,
    signerOrProvider: signer,
  });
};
