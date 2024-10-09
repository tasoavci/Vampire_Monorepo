import { Module } from '@nestjs/common';
import { DataController } from './data.controller';
import { PrismaService } from './../../prisma/prisma.service';
import { AuthModule } from '../auth/auth.module';
import { DataService } from './data.service';

@Module({
    imports: [AuthModule],
    controllers: [DataController],
    providers: [DataService, PrismaService]
})
export class DataModule { }