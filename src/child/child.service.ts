import { HttpStatus, Injectable } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { InjectRepository } from '@nestjs/typeorm';
import { getManager, Repository } from 'typeorm';
import { ChildDto } from './dto/child.dto';
import { Child } from './entities/child.entity';
import { User } from 'src/user/entities/user.entity';
import { GetChildDto } from './dto/get.child.dto';
import { Card } from 'src/card/entities/card.entity';
import { BaseError, ErrorsEnum } from 'src/core/errors/base.error';

@Injectable()
export class ChildService {
  @InjectRepository(Child)
  private childsRepository: Repository<Child>;

  async createChild(user: User, childDto: ChildDto): Promise<GetChildDto> {
    const child = await this.childsRepository
      .createQueryBuilder()
      .insert()
      .into(Child)
      .values({ ...childDto, userId: user.id })
      .returning('*')
      .execute();

    return plainToClass(GetChildDto, child.generatedMaps[0], {
      strategy: 'excludeAll'
    });
  }

  async updateChild(
    user: User,
    id: number,
    childDto: ChildDto
  ): Promise<ChildDto> {
    const child = await this.childsRepository
      .createQueryBuilder()
      .update(Child)
      .set({ ...childDto, userId: user.id })
      .where('id = :id', {
        id
      })
      .andWhere('userId = :userId', { userId: user.id })
      .returning('*')
      .execute();

    if (child.raw.length === 0) {
      throw new BaseError(
        HttpStatus.BAD_REQUEST,
        ErrorsEnum.childError,
        'child does not exists or does not belong to user'
      );
    }

    return plainToClass(ChildDto, child.raw[0], {
      strategy: 'excludeAll'
    });
  }

  async getChildren(user: User): Promise<GetChildDto[]> {
    const childs = await this.childsRepository.find({
      where: {
        userId: user.id
      }
    });

    return plainToClass(GetChildDto, childs, {
      strategy: 'excludeAll'
    });
  }

  async deleteChild(user: User, id: number): Promise<void> {
    await getManager().transaction(async (transactionalEntityManager) => {
      const child = await transactionalEntityManager
        .createQueryBuilder()
        .softDelete()
        .from(Child)
        .where({ id })
        .andWhere('userId = :userId', { userId: user.id })
        .returning('*')
        .execute();

      await transactionalEntityManager
        .createQueryBuilder()
        .softDelete()
        .from(Card)
        .where({ id })
        .execute();

      if (child.raw.length === 0) {
        throw new BaseError(
          HttpStatus.BAD_REQUEST,
          ErrorsEnum.childError,
          'child does not exists or does not belong to user'
        );
      }
    });
  }
}
