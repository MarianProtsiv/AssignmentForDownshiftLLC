import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToClass } from 'class-transformer';
import { BaseError, ErrorsEnum } from 'src/core/errors/base.error';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { CardDto } from './dto/card.dto';
import { GetCardDto } from './dto/get.card.dto';
import { UpdateCardDto } from './dto/update.card.dto';
import { Card } from './entities/card.entity';
import luhn from 'luhn';

@Injectable()
export class CardService {
  @InjectRepository(Card)
  private cardsRepository: Repository<Card>;

  async createCard(user: User, cardDto: CardDto): Promise<GetCardDto> {
    const validCard = luhn.validate(cardDto.number);
    if (!validCard) {
      throw new BaseError(
        HttpStatus.BAD_REQUEST,
        ErrorsEnum.cardNotValid,
        'card is not valid'
      );
    }
    const card = await this.cardsRepository
      .createQueryBuilder()
      .insert()
      .into(Card)
      .values({ ...cardDto, userId: user.id })
      .orIgnore('DO NOTHING')
      .returning('*')
      .execute();

    if (card.raw.length === 0) {
      throw new BaseError(
        HttpStatus.BAD_REQUEST,
        ErrorsEnum.cardError,
        'duplicated card for same child'
      );
    }

    return plainToClass(GetCardDto, card.generatedMaps[0], {
      strategy: 'excludeAll'
    });
  }

  async updateCard(
    user: User,
    id: number,
    updateCardDto: UpdateCardDto
  ): Promise<CardDto> {
    const card = await this.cardsRepository
      .createQueryBuilder()
      .update(Card)
      .set({ ...updateCardDto, userId: user.id })
      .where('id = :id', {
        id
      })
      .andWhere('userId = :userId', { userId: user.id })
      .returning('*')
      .execute();

    if (card.raw.length === 0) {
      throw new BaseError(
        HttpStatus.BAD_REQUEST,
        ErrorsEnum.cardError,
        'card does not exists or does not belong to user'
      );
    }

    return plainToClass(CardDto, card.raw[0], {
      strategy: 'excludeAll'
    });
  }

  async getCards(user: User): Promise<GetCardDto[]> {
    const cards = await this.cardsRepository.find({
      where: {
        userId: user.id
      }
    });
    for (const card of cards) {
      card.number = card.number.replace(/\d(?=\d{4})/gm, '*');
      card.securityCode = card.securityCode.replace(/\d(?=\d{1})/gm, '*');
    }

    return plainToClass(GetCardDto, cards, {
      strategy: 'excludeAll'
    });
  }

  async deleteCard(user: User, id: number): Promise<void> {
    const card = await this.cardsRepository
      .createQueryBuilder()
      .softDelete()
      .from(Card)
      .where({ id })
      .andWhere('userId = :userId', { userId: user.id })
      .returning('*')
      .execute();

    if (card.raw.length === 0) {
      throw new BaseError(
        HttpStatus.BAD_REQUEST,
        ErrorsEnum.cardError,
        'card does not exists or does not belong to user'
      );
    }
  }
}
