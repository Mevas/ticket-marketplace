import { Injectable, OnModuleInit } from '@nestjs/common';
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
import { BigNumber, Event } from 'ethers';
import { EventsService } from '../events/events.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class TicketsService implements OnModuleInit {
  contract: CryptoTicket;

  constructor(
    private prisma: PrismaService,
    private eventsService: EventsService,
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

  async onModuleInit() {
    let mintingForEvent = -1;

    this.contract.on('MintingForEvent', (async (eventId, event) => {
      mintingForEvent = eventId.toNumber();
    }) as (eventId: BigNumber, event: Event) => void);

    this.contract.on('Transfer', (async (from, to, id) => {
      const event = await this.eventsService.getEventOwnedByAddress(
        mintingForEvent,
        to,
      );
      if (!event) {
        console.warn('User is not owner of project');
        return;
      }

      try {
        await this.prisma.ticket.create({
          data: {
            event: {
              connect: {
                id: mintingForEvent,
              },
            },
            art: null,
            tier: 'GA',
            id: id.toNumber(),
            number: -1,
          },
        });
      } catch (e) {
        if (e instanceof Prisma.PrismaClientKnownRequestError) {
          console.log('Tried recreating a ticket');
        }
      }
    }) as (from: string, to: string, id: BigNumber, event: Event) => void);
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

    console.log(ticketIds);

    return await this.prisma.ticket.findMany({
      where: {
        id: {
          in: ticketIds,
        },
      },
      orderBy: {
        id: 'asc',
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
