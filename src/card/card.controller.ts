import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { SwaggerRouteDecorator } from 'src/core/decorators';
import { GetUser } from 'src/user/decorators/user';
import { User } from 'src/user/entities/user.entity';
import { CardService } from './card.service';
import { CardDto } from './dto/card.dto';
import { GetCardDto } from './dto/get.card.dto';
import { UpdateCardDto } from './dto/update.card.dto';

@Controller('card')
export class CardController {
  constructor(private readonly cardService: CardService) {}

  @SwaggerRouteDecorator({
    apiOperationData: { summary: 'Create card' },
    apiResponseData: { status: 200, type: GetCardDto },
    apiBodyData: { type: CardDto }
  })
  @HttpCode(200)
  @Post()
  @UseGuards(AuthGuard('jwt'))
  async createCard(
    @GetUser() user: User,
    @Body() cardDto: CardDto
  ): Promise<GetCardDto> {
    return await this.cardService.createCard(user, cardDto);
  }

  @SwaggerRouteDecorator({
    apiOperationData: { summary: 'Update card' },
    apiResponseData: { status: 200, type: UpdateCardDto },
    apiBodyData: { type: UpdateCardDto }
  })
  @HttpCode(200)
  @Patch(':id')
  @UseGuards(AuthGuard('jwt'))
  updateCard(
    @GetUser() user: User,
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCardDto: UpdateCardDto
  ): Promise<UpdateCardDto> {
    return this.cardService.updateCard(user, id, updateCardDto);
  }

  @SwaggerRouteDecorator({
    apiOperationData: { summary: 'Get all cards' },
    apiResponseData: { status: 200, type: [GetCardDto] }
  })
  @HttpCode(200)
  @Get()
  @UseGuards(AuthGuard('jwt'))
  async getCards(@GetUser() user: User): Promise<GetCardDto[]> {
    return await this.cardService.getCards(user);
  }

  @SwaggerRouteDecorator({
    apiOperationData: { summary: 'Delete card' },
    apiResponseData: { status: 200 }
  })
  @HttpCode(200)
  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  async deleteCard(
    @GetUser() user: User,
    @Param('id', ParseIntPipe) id: number
  ): Promise<void> {
    return await this.cardService.deleteCard(user, id);
  }
}
