import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { SwaggerRouteDecorator } from 'src/core/decorators';
import { CreateTransactionDto } from './dto/create.transaction.dto';
import { TransactionService } from './transaction.service';

@Controller('transaction')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @SwaggerRouteDecorator({
    apiOperationData: { summary: 'Registration of user' },
    apiResponseData: { status: 200 },
    apiBodyData: { type: CreateTransactionDto }
  })
  @HttpCode(200)
  @Post()
  async purchase(
    @Body() createTransactionDto: CreateTransactionDto
  ): Promise<void> {
    return this.transactionService.purchase(createTransactionDto);
  }
}
