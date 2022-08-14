import { Controller, Get, UseGuards } from '@nestjs/common';
import { TicketsService } from './tickets.service';
import { AuthGuard } from '../guards/auth.guard';
import { CurrentUser } from '../utils/decorators/current-user.decorator';
import { User } from '@prisma/client';

@Controller('tickets')
@UseGuards(AuthGuard)
export class TicketsController {
  constructor(private readonly ticketsService: TicketsService) {}

  @Get('mine')
  async findMyTickets(@CurrentUser() user: User) {
    return await this.ticketsService.getTickets(user.walletAddress);
  }
}
