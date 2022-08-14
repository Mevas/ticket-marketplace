import { Module } from '@nestjs/common';
import { CryptoTicketService } from './crypto-ticket.service';
import { EthersModule } from 'nestjs-ethers';

@Module({
  providers: [CryptoTicketService],
  imports: [
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
  exports: [CryptoTicketService],
})
export class CryptoTicketModule {}
