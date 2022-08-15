import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { TicketsService } from './tickets.service';
import { AuthGuard } from '../guards/auth.guard';
import { CurrentUser } from '../utils/decorators/current-user.decorator';
import { User } from '@prisma/client';
import { Public } from '../utils/decorators/public.decorator';

@Controller('tickets')
@UseGuards(AuthGuard)
export class TicketsController {
  constructor(private readonly ticketsService: TicketsService) {}

  @Get('mine')
  async findMyTickets(@CurrentUser() user: User) {
    return await this.ticketsService.getTickets(user.walletAddress);
  }

  @Get('verify/:signedTicket')
  @Public()
  async verifyTicket(
    @CurrentUser() user: User,
    @Param('signedTicket') signedTicketB64: string,
  ) {
    const buf = new Buffer(signedTicketB64, 'base64');
    const signedTicket = JSON.parse(buf.toString('ascii'));
    return await this.ticketsService.verifyTicket(signedTicket);
  }
}
