import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuthModule } from './auth/auth.module';
import { DataModule } from './data/data.module';

@Module({
  imports: [AuthModule, DataModule],
  providers: [PrismaService],
  exports: [PrismaService],
})
export class AppModule { }