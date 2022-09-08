import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { BigNumber, ethers, Event } from 'ethers';
import { EventsService } from '../events/events.service';
import { Prisma } from '@prisma/client';
import { CryptoTicketService } from '../crypto-ticket/crypto-ticket.service';

@Injectable()
export class TicketsService implements OnModuleInit {
  constructor(
    private prisma: PrismaService,
    private eventsService: EventsService,
    private cryptoTickets: CryptoTicketService,
  ) {}

  async onModuleInit() {
    let mintingForEvent = -1;

    this.cryptoTickets.contract.on('MintingForEvent', (async (eventId) => {
      mintingForEvent = eventId.toNumber();
    }) as (eventId: BigNumber, event: Event) => void);

    this.cryptoTickets.contract.on('Transfer', (async (from, to, id) => {
      if (from !== ethers.constants.AddressZero) {
        console.log('normal transfer', from, to, id);
      } else {
        const event = await this.eventsService.getEventOwnedByAddress(
          mintingForEvent,
          to,
        );

        if (!event) {
          console.warn(`User ${to} is not owner of project ${mintingForEvent}`);
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
              art: 'https://images.hdqwalls.com/wallpapers/formation-abstract-colors-4k-1e.jpg',
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
      }
    }) as (from: string, to: string, id: BigNumber, event: Event) => void);
  }

  async getTickets(address: string) {
    const ticketIds = await this.cryptoTickets.getTicketIdsOfAddress(address);

    return await this.prisma.ticket.findMany({
      where: {
        id: {
          in: ticketIds,
        },
      },
      include: {
        event: true,
      },
      orderBy: {
        id: 'asc',
      },
    });
  }

  async verifyTicket(signedTicket: { message: string; signedMessage: string }) {
    const messageAddress = ethers.utils.verifyMessage(
      signedTicket.message,
      signedTicket.signedMessage,
    );

    const ownerOfTicket = await this.cryptoTickets.contract.ownerOf(
      +signedTicket.message,
    );

    return ownerOfTicket === messageAddress;
  }
}
