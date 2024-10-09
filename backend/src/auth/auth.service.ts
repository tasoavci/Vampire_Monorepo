import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from './../../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { createHash, randomBytes } from 'crypto';
import { EmailService } from 'src/email/email.service';


@Injectable()
export class AuthService {

    generateVerificationToken(): string {
        return randomBytes(16).toString('hex');
    }
    constructor(
        private prisma: PrismaService,
        private jwtService: JwtService,
        private emailService: EmailService
    ) { }

    async register(name: string, lastName: string, email: string, password: string,): Promise<any> {
        const existingUser = await this.prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            throw new ConflictException('E-posta adresi zaten kullanılıyor.');
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const verificationToken = this.generateVerificationToken();
        const user = await this.prisma.user.create({
            data: {
                name,
                lastName,
                email,
                password: hashedPassword,
                verificationToken,
                isVerified: false
            }
        });

        await this.emailService.sendVerificationEmail(email, verificationToken);
        return user;
    }

    async verifyEmail(token: string): Promise<any> {
        const user = await this.prisma.user.findUnique({
            where: { verificationToken: token }
        });

        if (!user) {
            throw new NotFoundException('Kullanıcı bulunamadı veya token geçersiz.');
        }

        await this.prisma.user.update({
            where: { id: user.id },
            data: { isVerified: true, verificationToken: null }
        });

        return { message: 'E-posta başarıyla doğrulandı.' };
    }
    async requestPasswordReset(email: string): Promise<void> {
        const user = await this.prisma.user.findUnique({ where: { email } });
        if (!user) {
            throw new Error('User not found');
        }

        const resetToken = randomBytes(20).toString('hex');
        const hash = createHash('sha256').update(resetToken).digest('hex');
        const expiration = new Date(Date.now() + 3600000);

        await this.prisma.user.update({
            where: { email: email },
            data: {
                resetTokenHash: hash,
                resetTokenExpire: expiration
            }
        });

        const resetLink = `${process.env.baseUrl}/auth/reset-password?token=${resetToken}&email=${email}`;
        await this.emailService.sendResetPasswordEmail(email, resetLink);
    }
    async resetPassword(token: string, newPassword: string): Promise<void> {
        const user = await this.prisma.user.findFirst({
            where: {
                resetTokenHash: createHash('sha256').update(token).digest('hex'),
                resetTokenExpire: {
                    gt: new Date()
                }
            }
        });
        if (!user) {
            throw new Error('Geçersiz veya süresi dolmuş token.');
        }
        const hashedNewPassword = await bcrypt.hash(newPassword, 10);
        await this.prisma.user.update({
            where: { id: user.id },
            data: {
                password: hashedNewPassword,
                resetTokenHash: null,
                resetTokenExpire: null
            }
        });
    }

    async validateUser(email: string, password: string): Promise<any> {
        const user = await this.prisma.user.findUnique({ where: { email } });
        if (user && await bcrypt.compare(password, user.password)) {
            const { password, ...result } = user;
            return result;
        }
        return null;
    }

    async login(user: any) {
        const payload = { email: user.email, sub: user.userId };
        return {
            accessToken: this.jwtService.sign(payload),
            refreshToken: this.jwtService.sign(payload, {
                secret: process.env.JWT_SECRET,
                expiresIn: '7d'
            })
        };
    }
}