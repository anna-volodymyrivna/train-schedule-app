import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTrainDto } from './dto/create-train.dto';
import { UpdateTrainDto } from './dto/update-train.dto';

@Injectable()
export class TrainsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createTrainDto: CreateTrainDto) {
    return this.prisma.train.create({
      data: {
        number: createTrainDto.number,
        fromStation: createTrainDto.fromStation,
        toStation: createTrainDto.toStation,
        departureTime: new Date(createTrainDto.departureTime),
        arrivalTime: new Date(createTrainDto.arrivalTime),
      },
    });
  }

  async findAll() {
    return this.prisma.train.findMany({
      orderBy: { departureTime: 'asc' },
    });
  }

  async findOne(id: number) {
    const train = await this.prisma.train.findUnique({ where: { id } });
    if (!train) {
      throw new NotFoundException(`Train with ID ${id} not found`);
    }
    return train;
  }

  async update(id: number, updateTrainDto: UpdateTrainDto) {
    await this.findOne(id);
    return this.prisma.train.update({
      where: { id },
      data: {
        ...updateTrainDto,
        departureTime: updateTrainDto.departureTime
          ? new Date(updateTrainDto.departureTime)
          : undefined,
        arrivalTime: updateTrainDto.arrivalTime
          ? new Date(updateTrainDto.arrivalTime)
          : undefined,
      },
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.train.delete({ where: { id } });
  }
}
