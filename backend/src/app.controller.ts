import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from './auth/jwt-auth.guard';

@Controller('data')
export class AppController {
  @UseGuards(JwtAuthGuard)
  @Get('getSomeDatas')
  getSomeDatas() {
    return "this data not for unauthorized users.";
  }
}