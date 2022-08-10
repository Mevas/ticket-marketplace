import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import * as Web3Token from 'web3-token';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Always allow access to public endpoints
    const isPublic = this.reflector.get<string[]>(
      'isPublic',
      context.getHandler(),
    );

    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest();

    let address: string;
    try {
      ({ address } = Web3Token.verify(request.headers['authorization']));
    } catch (e) {
      throw new UnauthorizedException(e.message);
    }

    const user = await this.prisma.user.findUnique({
      where: {
        walletAddress: address,
      },
    });

    if (user === null) {
      throw new UnauthorizedException('Please create a user');
    }

    request;

    return true;
  }
}
