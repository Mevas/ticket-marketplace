import { Module } from '@nestjs/common';
import { TicketsService } from './tickets.service';
import { TicketsController } from './tickets.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { EventsModule } from '../events/events.module';
import { CryptoTicketModule } from '../crypto-ticket/crypto-ticket.module';

@Module({
  controllers: [TicketsController],
  providers: [TicketsService],
  imports: [PrismaModule, EventsModule, CryptoTicketModule],
})
export class TicketsModule {}
