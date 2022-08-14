import { Injectable } from '@nestjs/common';
import { contractAddresses, CryptoTicketABI } from '../utils/hardhat';
import { CryptoTicket } from '../hardhat/typechain-types';
import {
  BaseProvider,
  EthersContract,
  EthersSigner,
  InjectContractProvider,
  InjectEthersProvider,
  InjectSignerProvider,
  Wallet,
} from 'nestjs-ethers';

@Injectable()
export class CryptoTicketService {
  contract: CryptoTicket;
  wallet: Wallet;

  constructor(
    @InjectEthersProvider()
    private readonly ethersProvider: BaseProvider,
    @InjectContractProvider()
    private readonly ethersContract: EthersContract,
    @InjectSignerProvider()
    private readonly ethersSigner: EthersSigner,
  ) {
    this.wallet = this.ethersSigner.createWallet(
      '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80',
    );

    this.contract = this.ethersContract.create(
      contractAddresses.CryptoTicket,
      CryptoTicketABI.abi,
      this.wallet,
    ) as CryptoTicket;
  }

  async getTicketIdsOfAddress(address: string) {
    return (await this.contract.tokensOfOwner(address)).map((id) =>
      id.toNumber(),
    );
  }
}
