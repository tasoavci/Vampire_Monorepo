import { Controller, Get, UseGuards } from '@nestjs/common';
import { DataService } from './data.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('data')
export class DataController {
    constructor(private dataService: DataService) { }

    @UseGuards(JwtAuthGuard)
    @Get('getSomeDatas')
    async getSomeDatas() {
        return await this.dataService.getSomeDatas();
    }
}