/* eslint-disable */
import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TrainsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: any, userId: number) {
    const trainNumber = dto.trainNumber;
    const departureStation = dto.departureStation;
    const arrivalStation = dto.arrivalStation;
    const departureTime = dto.departureTime;
    const arrivalTime = dto.arrivalTime;

    if (!userId) {
      throw new BadRequestException('User ID is missing from token');
    }

    const existingTrain = await this.prisma.train.findFirst({
      where: { trainNumber: String(trainNumber) },
    });

    if (existingTrain) {
      throw new BadRequestException('Train with this number already exists');
    }

    return this.prisma.train.create({
      data: {
        trainNumber: String(trainNumber),
        departureStation: String(departureStation),
        arrivalStation: String(arrivalStation),
        departureTime: new Date(departureTime),
        arrivalTime: new Date(arrivalTime),
        userId: Number(userId),
      },
    });
  }

  async findMyTrains(userId: number) {
    return this.prisma.train.findMany({
      where: { userId: userId },
      orderBy: { departureTime: 'asc' },
    });
  }

  async findAll() {
    return this.prisma.train.findMany({
      orderBy: { departureTime: 'asc' },
    });
  }

  async findOne(id: number) {
    const train = await this.prisma.train.findUnique({ where: { id } });
    if (!train) throw new NotFoundException('Train not found');
    return train;
  }

  async update(id: number, dto: any) {
    await this.findOne(id);
    const dataObj = dto as Record<string, string>;

    return this.prisma.train.update({
      where: { id },
      data: {
        trainNumber: dataObj.trainNumber,
        departureStation: dataObj.departureStation,
        arrivalStation: dataObj.arrivalStation,
        departureTime: dataObj.departureTime
          ? new Date(dataObj.departureTime)
          : undefined,
        arrivalTime: dataObj.arrivalTime
          ? new Date(dataObj.arrivalTime)
          : undefined,
      },
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.train.delete({ where: { id } });
  }
}
