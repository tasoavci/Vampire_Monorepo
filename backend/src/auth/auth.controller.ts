import { Controller, Post, Body, Request, UseGuards, UnauthorizedException, Get, Query, HttpCode, HttpStatus, HttpException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { LocalAuthGuard } from './local-auth.guard';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @Post('register')
    async register(@Body() body: { name: string; lastName: string; email: string; password: string }) {
        return this.authService.register(body.name, body.lastName, body.email, body.password);
    }
    @Get('verify-email')
    async verifyEmail(@Query('token') token: string): Promise<any> {
        return await this.authService.verifyEmail(token);
    }
    @Post('request-password-reset')
    @HttpCode(HttpStatus.OK)
    async requestPasswordReset(@Body() body: { email: string }) {
        try {
            await this.authService.requestPasswordReset(body.email);
            return { message: 'Şifre sıfırlama bağlantısı e-posta ile gönderildi.' };
        } catch (error) {
            throw new HttpException('E-posta gönderilirken bir hata oluştu.', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    @Get('reset-password')
    async resetPassword(@Query() query: { token: string }) {
        try {
            return { message: 'Yonlendiriliyorsunuz...' };
        } catch (error) {
            throw new HttpException('Şifre sıfırlama işlemi başarısız.', HttpStatus.BAD_REQUEST);
        }
    }

    @Post('complete-password-reset')
    @HttpCode(HttpStatus.OK)
    async completePasswordReset(@Body() body: { token: string, newPassword: string }) {
        try {
            await this.authService.resetPassword(body.token, body.newPassword);
            return { message: 'Your password has been successfully reset.' };
        } catch (error) {
            return { message: error.message, status: HttpStatus.BAD_REQUEST };
        }
    }

    @UseGuards(LocalAuthGuard)
    @Post('login')
    async login(@Request() req) {
        if (!req.user) {
            throw new UnauthorizedException('No user object found in request');
        }
        return this.authService.login(req.user);
    }
}