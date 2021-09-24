import { HttpStatus, Injectable } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { RegisterDto } from './dto/register.dto';
import { User } from './entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './interfaces/jwt.payload';
import { BaseError } from 'src/core/errors/base.error';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  @InjectRepository(User)
  private usersRepository: Repository<User>;

  constructor(private readonly jwtService: JwtService) {}

  getById(id: number): Promise<User> {
    return this.usersRepository.findOne(id);
  }

  getByEmail(email: string): Promise<User> {
    return this.usersRepository.findOne({ email });
  }

  async login(user: User): Promise<string> {
    return this.generateAccessToken({ id: user.id });
  }

  async register(registerDto: RegisterDto): Promise<string> {
    const newUser = plainToClass(User, registerDto);

    const user = await this.create(newUser);
    return this.generateAccessToken({ id: user.id });
  }

  async generateAccessToken(payload: JwtPayload): Promise<string> {
    return this.jwtService.signAsync(payload);
  }

  async create(user: User): Promise<User> {
    await user.hashPassword();
    await user.validate();
    const result = await this.usersRepository
      .createQueryBuilder()
      .insert()
      .into(User)
      .values(user)
      .orIgnore('DO NOTHING')
      .returning('*')
      .execute();

    if (result.raw.length === 0) {
      throw new BaseError(HttpStatus.BAD_REQUEST, 1, 'Email used');
    }

    return plainToClass(User, result.generatedMaps[0]);
  }
}
