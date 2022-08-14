import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { PrismaService } from '../prisma/prisma.service';
import { CryptoTicketService } from '../crypto-ticket/crypto-ticket.service';

@Injectable()
export class EventsService {
  constructor(
    private prisma: PrismaService,
    private cryptoTickets: CryptoTicketService,
  ) {}

  create(createEventDto: CreateEventDto, walletAddress: string) {
    return this.prisma.event.create({
      data: {
        ...createEventDto,
        organizer: {
          connect: {
            walletAddress,
          },
        },
      },
    });
  }

  findAll() {
    return this.prisma.event.findMany();
  }

  async getEvent(id: number) {
    const event = await this.prisma.event.findUnique({
      where: {
        id,
      },
    });

    return event;
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

    const ticketIds = await this.cryptoTickets.getTicketIdsOfAddress(
      event.organizer.walletAddress,
    );

    return {
      ...event,
      ticketCount: event._count.tickets,
      ticketSold: event._count.tickets - ticketIds.length,
    };
  }

  update(id: number, updateEventDto: UpdateEventDto) {
    return `This action updates a #${id} event`;
  }

  remove(id: number) {
    return `This action removes a #${id} event`;
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
      include: { organizer: true },
    });
  }
}
