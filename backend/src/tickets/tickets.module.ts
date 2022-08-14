import { Module } from '@nestjs/common';
import { TicketsService } from './tickets.service';
import { TicketsController } from './tickets.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { EthersModule } from 'nestjs-ethers';
import { EventsModule } from '../events/events.module';

@Module({
  controllers: [TicketsController],
  providers: [TicketsService],
  imports: [
    PrismaModule,
    EventsModule,
    EthersModule.forRoot({
      network: {
        name: 'hardhat',
        chainId: 1337,
        _defaultProvider: (providers) => {
          return new providers.JsonRpcProvider('http://127.0.0.1:8545/');
        },
      },
    }),
  ],
})
export class TicketsModule {}
