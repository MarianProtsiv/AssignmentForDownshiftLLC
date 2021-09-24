import { ChildService } from './child.service';
import {
  Controller,
  Post,
  Body,
  HttpCode,
  UseGuards,
  Get,
  Delete,
  Param,
  ParseIntPipe,
  Patch
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ChildDto } from './dto/child.dto';
import { GetUser } from 'src/user/decorators/user';
import { User } from 'src/user/entities/user.entity';
import { GetChildDto } from './dto/get.child.dto';
import { SwaggerRouteDecorator } from 'src/core/decorators';
@Controller('child')
export class ChildController {
  constructor(private readonly childService: ChildService) {}

  @SwaggerRouteDecorator({
    apiOperationData: { summary: 'Create child' },
    apiResponseData: { status: 200, type: GetChildDto },
    apiBodyData: { type: ChildDto }
  })
  @HttpCode(200)
  @Post()
  @UseGuards(AuthGuard('jwt'))
  async createChild(
    @GetUser() user: User,
    @Body() childDto: ChildDto
  ): Promise<GetChildDto> {
    return await this.childService.createChild(user, childDto);
  }

  @SwaggerRouteDecorator({
    apiOperationData: { summary: 'Update child' },
    apiResponseData: { status: 200, type: ChildDto },
    apiBodyData: { type: ChildDto }
  })
  @HttpCode(200)
  @Patch(':id')
  @UseGuards(AuthGuard('jwt'))
  updateChild(
    @GetUser() user: User,
    @Param('id', ParseIntPipe) id: number,
    @Body() updateChildDto: ChildDto
  ): Promise<ChildDto> {
    return this.childService.updateChild(user, id, updateChildDto);
  }

  @SwaggerRouteDecorator({
    apiOperationData: { summary: 'Get all children' },
    apiResponseData: { status: 200, type: [GetChildDto] }
  })
  @HttpCode(200)
  @Get()
  @UseGuards(AuthGuard('jwt'))
  async getChildren(@GetUser() user: User): Promise<GetChildDto[]> {
    return await this.childService.getChildren(user);
  }

  @SwaggerRouteDecorator({
    apiOperationData: { summary: 'Delete child' },
    apiResponseData: { status: 200 }
  })
  @HttpCode(200)
  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  async deleteChild(
    @GetUser() user: User,
    @Param('id', ParseIntPipe) id: number
  ): Promise<void> {
    return await this.childService.deleteChild(user, id);
  }
}
