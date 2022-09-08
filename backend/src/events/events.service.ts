import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateEventDto } from './dto/create-event.dto';
import { PrismaService } from '../prisma/prisma.service';
import { CryptoTicketService } from '../crypto-ticket/crypto-ticket.service';
import { Event, User } from '@prisma/client';
import _ from 'lodash';

@Injectable()
export class EventsService {
  constructor(
    private prisma: PrismaService,
    private cryptoTickets: CryptoTicketService,
  ) {}

  async create(createEventDto: CreateEventDto, walletAddress: string) {
    const event = await this.prisma.event.create({
      data: {
        ...createEventDto,
        organizer: {
          connect: {
            walletAddress,
          },
        },
      },
    });

    const transaction = await this.cryptoTickets.contract.setOrganizerOfEventId(
      event.id,
      walletAddress,
    );

    await transaction.wait();

    return event;
  }

  async getSoldTickets(
    event: Event & { organizer: User; _count: { tickets: number } },
  ) {
    const ticketIds = await this.cryptoTickets.getTicketIdsOfAddress(
      event.organizer.walletAddress,
    );

    const organizerTicketsInEvent = await this.prisma.ticket.count({
      where: {
        id: {
          in: ticketIds,
        },
        eventId: event.id,
      },
    });

    return event._count.tickets - organizerTicketsInEvent;
  }

  async findAll() {
    let events = await this.prisma.event.findMany({
      include: {
        _count: {
          select: {
            tickets: true,
          },
        },
        organizer: true,
      },
    });

    events = await Promise.all(
      events.map(async (event) => ({
        ...event,
        soldOut: (await this.getSoldTickets(event)) === event._count.tickets,
      })),
    );

    return events.map((event) => _.omit(event, ['_count']));
  }

  async getEvent(id: number) {
    const foundEvent = await this.prisma.event.findUnique({
      where: {
        id,
      },
      include: {
        _count: {
          select: {
            tickets: true,
          },
        },
        organizer: true,
      },
    });

    if (!foundEvent) {
      throw new BadRequestException('No event with the given id');
    }

    return {
      ...foundEvent,
      soldOut:
        (await this.getSoldTickets(foundEvent)) === foundEvent._count.tickets,
    };
  }

  async getEventAsAdmin(id: number) {
    const event = await this.prisma.event.findUnique({
      where: {
        id,
      },
      include: {
        _count: {
          select: {
            tickets: true,
          },
        },
        organizer: true,
      },
    });

    if (!event) {
      throw new BadRequestException('No event with the given id');
    }

    return {
      ...event,
      ticketCount: event._count.tickets,
      ticketSold: await this.getSoldTickets(event),
    };
  }

  async getEventOwnedByAddress(id: number, address: string) {
    return await this.prisma.event.findFirst({
      where: {
        id,
        organizer: {
          walletAddress: {
            equals: address.toLowerCase(),
          },
        },
      },
      include: {
        _count: {
          select: {
            tickets: true,
          },
        },
        organizer: true,
      },
    });
  }
}
