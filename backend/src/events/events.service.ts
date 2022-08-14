import { Injectable } from '@nestjs/common';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class EventsService {
  constructor(private prisma: PrismaService) {}

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

  findOne(id: number) {
    return `This action returns a #${id} event`;
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
