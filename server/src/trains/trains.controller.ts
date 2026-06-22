/* eslint-disable */
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { TrainsService } from './trains.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';

@Controller('trains')
export class TrainsController {
  constructor(private readonly trainsService: TrainsService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('admin/all')
  findAllForAdmin() {
    return this.trainsService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createTrainDto: any, @Req() req: any) {
    return this.trainsService.create(createTrainDto, req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('my')
  findMy(@Req() req: any) {
    return this.trainsService.findMyTrains(req.user.id);
  }

  @Get()
  findAll() {
    return this.trainsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.trainsService.findOne(+id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateTrainDto: any,
    @Req() req: any,
  ) {
    return this.trainsService.update(+id, updateTrainDto, req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: any) {
    return this.trainsService.remove(+id, req.user);
  }
}
