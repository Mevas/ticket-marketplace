import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { AuthGuard } from '../guards/auth.guard';
import { Public } from '../utils/decorators/public.decorator';
import { CurrentUser } from '../utils/decorators/current-user.decorator';
import { User } from '@prisma/client';

@Controller('events')
@UseGuards(AuthGuard)
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Post()
  create(@Body() createEventDto: CreateEventDto, @CurrentUser() user: User) {
    return this.eventsService.create(createEventDto, user.walletAddress);
  }

  @Get()
  @Public()
  findAll() {
    return this.eventsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.eventsService.getEventAsAdmin(+id);
  }
}
