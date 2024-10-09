import { Injectable } from '@nestjs/common';

@Injectable()
export class DataService {
    async getSomeDatas() {
        return { data: "example data, not allowed unauthorized users" }
    }
}