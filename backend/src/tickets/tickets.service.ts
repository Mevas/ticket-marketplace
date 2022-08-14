import { Injectable } from '@nestjs/common';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { PrismaService } from '../prisma/prisma.service';
import {
  BaseProvider,
  EthersContract,
  InjectContractProvider,
  InjectEthersProvider,
} from 'nestjs-ethers';
import { contractAddresses, CryptoTicketABI } from '../utils/hardhat';
import { CryptoTicket } from '../hardhat/typechain-types';

@Injectable()
export class TicketsService {
  contract: CryptoTicket;

  constructor(
    private prisma: PrismaService,
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

  create(createTicketDto: CreateTicketDto) {
    return 'This action adds a new ticket';
  }

  findAll() {
    return `This action returns all tickets`;
  }

  findOne(id: number) {
    return { text: `This action returns a #${id} ticket` };
  }

  async getTickets(address: string) {
    const ticketIds = (await this.contract.tokensOfOwner(address)).map((id) =>
      id.toNumber(),
    );

    return await this.prisma.ticket.findMany({
      where: {
        id: {
          in: ticketIds,
        },
      },
    });
  }

  update(id: number, updateTicketDto: UpdateTicketDto) {
    return `This action updates a #${id} ticket`;
  }

  remove(id: number) {
    return `This action removes a #${id} ticket`;
  }
}
