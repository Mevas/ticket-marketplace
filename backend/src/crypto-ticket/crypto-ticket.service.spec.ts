import { Test, TestingModule } from '@nestjs/testing';
import { CryptoTicketService } from './crypto-ticket.service';

describe('CryptoTicketService', () => {
  let service: CryptoTicketService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CryptoTicketService],
    }).compile();

    service = module.get<CryptoTicketService>(CryptoTicketService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
