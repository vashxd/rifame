import { Controller, Get, Post, Body, Patch, Param, UseGuards, Request, BadRequestException } from '@nestjs/common';
import { DrawsService } from './draws.service';
import { CreateDrawDto } from './dto/create-draw.dto';
import { UpdateDrawDto } from './dto/update-draw.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('draws')
export class DrawsController {
  constructor(private readonly drawsService: DrawsService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  create(@Body() createDrawDto: CreateDrawDto) {
    return this.drawsService.create(createDrawDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  findAll() {
    return this.drawsService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id') id: string) {
    return this.drawsService.findOne(+id);
  }

  @Get('raffle/:raffleId')
  @UseGuards(JwtAuthGuard)
  findByRaffle(@Param('raffleId') raffleId: string) {
    return this.drawsService.findByRaffleId(+raffleId);
  }

  @Post(':id/execute')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  executeDraw(@Param('id') id: string) {
    return this.drawsService.executeDraw(+id);
  }

  @Post('raffle/:raffleId/schedule')
  @UseGuards(JwtAuthGuard)
  scheduleDraw(@Param('raffleId') raffleId: string, @Body() createDrawDto: CreateDrawDto, @Request() req) {
    return this.drawsService.scheduleDrawForRaffle(+raffleId, createDrawDto, req.user);
  }

  @Patch(':id/verify')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  verifyDraw(@Param('id') id: string, @Body() updateDrawDto: UpdateDrawDto, @Request() req) {
    return this.drawsService.verifyDraw(+id, updateDrawDto, req.user.user_id);
  }
}