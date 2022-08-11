import * as Web3Token from 'web3-token';
import { BadRequestException } from '@nestjs/common';

export const getWalletAddress = (token: string) => {
  try {
    const { address } = Web3Token.verify(token);
    return address;
  } catch (e) {
    if (e instanceof Error) {
      throw new BadRequestException(e.message);
    }
  }
};
