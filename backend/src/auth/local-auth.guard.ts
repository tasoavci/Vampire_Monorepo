import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {
    constructor() {
        super();
    }

    handleRequest(err, user, info, context, status) {
        if (err || !user) {
            throw err || new UnauthorizedException('You are not authorized to perform the action');
        }
        return user;
    }
}