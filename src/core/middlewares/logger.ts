import { Logger } from '@nestjs/common';
import { Request, Response } from 'express';

type Next = () => void;

export async function logger(
  logger: Logger,
  request: Request,
  response: Response,
  next: Next
): Promise<void> {
  const start = Date.now();
  logger.log(`${request.method} ${request.url}`, 'Http');
  response.on('finish', () => {
    logger.log(
      `${request.method} ${request.url} ${response.statusCode} ${
        Date.now() - start
      } ms`,
      'Http'
    );
  });
  next();
}
