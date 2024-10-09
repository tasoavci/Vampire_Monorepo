import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
    private transporter;

    constructor() {
        this.transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USERNAME,
                pass: process.env.EMAIL_PASSWORD
            }
        });
    }

    async sendVerificationEmail(to: string, token: string) {
        const verificationUrl = `${process.env.baseURL}/auth/verify-email?token=${token}`;
        const mailOptions = {
            from: process.env.EMAIL_USERNAME,
            to: to,
            subject: 'Verify Your Email',
            text: `Please click on the following link to verify your email: ${verificationUrl}`,
            html: `<p>Please click on the link below to verify your email:</p><p><a href="${verificationUrl}">Verify Email</a></p>`
        };

        return this.transporter.sendMail(mailOptions);
    }
    async sendResetPasswordEmail(email: string, link: string): Promise<void> {
        await this.transporter.sendMail({
            from: process.env.EMAIL_USERNAME,
            to: email,
            subject: 'Reset Your Password',
            html: `<p>Please click on the following link to reset your password: <a href="${link}">Reset Password</a></p>`
        });
    }
}