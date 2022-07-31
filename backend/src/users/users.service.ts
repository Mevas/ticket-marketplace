import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto, address: string) {
    return await this.prisma.user.create({
      data: {
        ...createUserDto,
        walletAddress: address,
      },
    });
  }

  findAll() {
    return `This action returns all users`;
  }

  findOne(address: string) {
    return this.prisma.user.findUnique({
      where: {
        walletAddress: address,
      },
    });
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
