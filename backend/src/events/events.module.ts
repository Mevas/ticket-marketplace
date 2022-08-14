import { Module } from '@nestjs/common';
import { EventsService } from './events.service';
import { EventsController } from './events.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { CryptoTicketModule } from '../crypto-ticket/crypto-ticket.module';

@Module({
  controllers: [EventsController],
  providers: [EventsService],
  imports: [PrismaModule, CryptoTicketModule],
  exports: [EventsService],
})
export class EventsModule {}
