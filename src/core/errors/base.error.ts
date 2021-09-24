import { HttpException } from '@nestjs/common';

export enum ErrorsEnum {
  cardError = 1000,
  childError = 1001,
  maxMounthlyLimit = 1002,
  cardNotValid = 1003
}

export class BaseError extends HttpException {
  constructor(
    statusCode: number,
    public errorCode: number,
    error: string | Record<string, any>
  ) {
    super(error, statusCode);
  }
}
