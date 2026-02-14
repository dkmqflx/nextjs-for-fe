import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { AccessTokenGuard } from 'src/common/guards/access-token.guard';
import type { Request } from 'express';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './user.entity';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  // GET user info
  @UseGuards(AccessTokenGuard)
  @Get('me')
  async getMe(@Req() req: Request) {
    const userId = req.user!.sub;
    const user = await this.usersService.findById(userId);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return this.shieldUserInformation(user);
  }

  // PUT user
  @UseGuards(AccessTokenGuard)
  @Put('me')
  async updateUser(@Req() req: Request, @Body() updateUserDto: UpdateUserDto) {
    const user = await this.usersService.update(
      req.user!['sub'],
      updateUserDto,
    );

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return this.shieldUserInformation(user);
  }

  // DELETE user
  @UseGuards(AccessTokenGuard)
  @Delete('me')
  async remove(@Req() req: Request) {
    return this.usersService.remove(req.user!['sub']);
  }

  // 유저 정보 보호를 위해 password와 refreshToken을 제외한 정보를 반환
  private shieldUserInformation(user: User) {
    return { ...user, password: undefined, refreshToken: undefined };
  }
}
