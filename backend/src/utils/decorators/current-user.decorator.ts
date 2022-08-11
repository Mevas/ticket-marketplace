import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from '@prisma/client';
import { Request } from 'express';

export const CurrentUser = createParamDecorator(
  (param: keyof User, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest<Request>();
    return param ? request.user?.[param] : request.user;
  },
);
