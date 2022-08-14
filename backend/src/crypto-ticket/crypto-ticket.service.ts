import { Injectable } from '@nestjs/common';
import { contractAddresses, CryptoTicketABI } from '../utils/hardhat';
import { CryptoTicket } from '../hardhat/typechain-types';
import {
  BaseProvider,
  EthersContract,
  InjectContractProvider,
  InjectEthersProvider,
} from 'nestjs-ethers';

@Injectable()
export class CryptoTicketService {
  contract: CryptoTicket;

  constructor(
    @InjectEthersProvider()
    private readonly ethersProvider: BaseProvider,
    @InjectContractProvider()
    private readonly ethersContract: EthersContract,
  ) {
    this.contract = this.ethersContract.create(
      contractAddresses.CryptoTicket,
      CryptoTicketABI.abi,
    ) as CryptoTicket;
  }

  async getTicketIdsOfAddress(address: string) {
    const ticketIds = (await this.contract.tokensOfOwner(address)).map((id) =>
      id.toNumber(),
    );

    return ticketIds;
  }
}
