import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Card } from 'src/card/entities/card.entity';
import { getManager, Repository } from 'typeorm';
import { CreateTransactionDto } from './dto/create.transaction.dto';
import { Transaction } from './entities/transaction.entity';
import moment from 'moment';
import { BaseError, ErrorsEnum } from 'src/core/errors/base.error';
import luhn from 'luhn';

@Injectable()
export class TransactionService {
  @InjectRepository(Transaction)
  private transactionRepository: Repository<Transaction>;
  @InjectRepository(Card)
  private cardsRepository: Repository<Card>;

  async purchase(createTransactionDto: CreateTransactionDto): Promise<void> {
    await getManager().transaction(async (transactionalEntityManager) => {
      const validCard = luhn.validate(createTransactionDto.number);
      if (!validCard) {
        throw new BaseError(
          HttpStatus.BAD_REQUEST,
          ErrorsEnum.cardNotValid,
          'card is not valid'
        );
      }
      const card = await this.cardsRepository.find({
        where: {
          childId: createTransactionDto.childId,
          number: createTransactionDto.number
        },
        loadRelationIds: {
          relations: ['childId']
        }
      });

      const date = new Date();

      const format = 'YYYY-MM-DD HH:mm:ss';

      const startOfMonth = moment(date).startOf('month').format(format);
      const endOfMonth = moment(date).endOf('month').format(format);

      const amountForCurrentMounth = await transactionalEntityManager.query(`
        select  
          sum(amount) 
        from transactions 
        where "createdAt" between '${startOfMonth}' and '${endOfMonth}'`);

      if (
        amountForCurrentMounth.length > 0 &&
        amountForCurrentMounth[0].sum + createTransactionDto.amount >
          card[0].monthlyLimit
      ) {
        throw new BaseError(
          HttpStatus.BAD_REQUEST,
          ErrorsEnum.maxMounthlyLimit,
          'mounthly limit over'
        );
      }

      await transactionalEntityManager
        .createQueryBuilder()
        .insert()
        .into(Transaction)
        .values({
          ...createTransactionDto,
          cardId: card[0].id,
          childId: card[0].childId
        })
        .execute();
    });
  }
}
