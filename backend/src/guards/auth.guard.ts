import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PrismaService } from '../prisma/prisma.service';
import { getWalletAddress } from '../utils';
import { Request } from 'express';

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

    const request = context.switchToHttp().getRequest<Request>();

    if (!request.headers.authorization) {
      throw new UnauthorizedException('Missing auth token');
    }

    // Verify that it is a valid web3 token
    const address = getWalletAddress(request.headers.authorization);

    // Check to see if the wallet address is associated with a centralized user
    const user = await this.prisma.user.findUnique({
      where: {
        walletAddress: address,
      },
    });

    // If not, the user should sign up (automatically handled on the frontend)
    if (user === null) {
      throw new UnauthorizedException('Please create a user');
    }

    // Set the user in the request context for further usage in utility decorators
    request.user = user;

    return true;
  }
}
