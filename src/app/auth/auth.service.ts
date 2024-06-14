import { JwtPayload } from 'jsonwebtoken';
import prisma from '../../db';
import { MAIL_HOST, NODE_ENV } from '../../utils/config';
import { compare, hash } from '../../utils/hash';
import { generateAccessToken, generateRefreshToken, generateVerifyToken, verifyRefreshToken, verifyVerifyToken } from '../../utils/jwt';
import { transporter } from '../../utils/mailer';
import { LoginType, RegisterType } from './auth.type';

export const register = async (body: RegisterType) => {
    const userWithSameEmail = await prisma.user.findUnique({
        where: {
            email: body.email,
        },
    });

    if (userWithSameEmail) {
        throw new Error('Email already exists');
    }

    if (body.password !== body.confirmPassword) {
        throw new Error('Password confirmation not match');
    }

    const hashPassword = await hash(body.password);

    const user = await prisma.user.create({
        data: {
            email: body.email,
            password: hashPassword,
        },
        select: {
            userId: true,
            email: true,
            createdAt: true,
        },
    });

    const verificationToken = generateVerifyToken({ userId: user.userId });
    const verificationLink = `http://localhost:4000/api/auth/verification?token=${verificationToken}`;

    if (NODE_ENV !== 'development') {
        transporter.sendMail({
            from: `noreply@${MAIL_HOST}`,
            to: user.email,
            subject: 'Email Verification',
            text: 'Email Verification',
            html: `<div><h1>Click button to verify</h1><a href="${verificationLink}">Verify</a></div>`,
        });
    }

    return user;
};

export const login = async (body: LoginType) => {
    const user = await prisma.user.findUnique({
        where: {
            email: body.email,
        },
    });

    if (!user) {
        throw new Error('Invalid credentials');
    }

    const isPasswordValid = await compare(body.password, user.password);

    if (!isPasswordValid) {
        throw new Error('Invalid credentials');
    }

    const tokenPayload = { userId: user.userId };
    const accessToken = generateAccessToken(tokenPayload);
    const refreshToken = generateRefreshToken(tokenPayload);

    return {
        user: {
            userId: user.userId,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            emailVerifiedAt: user.emailVerifiedAt,
        },
        accessToken,
        refreshToken,
    };
};

export const refresh = async (token: string) => {
    try {
        const decodedToken = verifyRefreshToken(token);
        const accessToken = generateAccessToken(decodedToken as JwtPayload);
        return accessToken;
    } catch (error: any) {
        throw new Error('Invalid refresh token');
    }
};

export const verifyEmail = async (token: string) => {
    try {
        const decodedToken = verifyVerifyToken(token);

        await prisma.user.update({
            data: {
                emailVerifiedAt: new Date(),
            },
            where: {
                userId: (decodedToken as JwtPayload).userId,
            },
        });
    } catch (error: any) {
        throw new Error('Invalid verification token');
    }
};

export const resendVerificationEmail = async (userId: string) => {
    const user = await prisma.user.findUnique({
        where: {
            userId,
        },
    });

    if (!user) {
        throw new Error('User not found');
    }

    if (user.emailVerifiedAt) {
        throw new Error('Email already verified');
    }

    const verificationToken = generateVerifyToken({ userId: user.userId });
    const verificationLink = `http://localhost:4000/api/auth/verification?token=${verificationToken}`;

    transporter.sendMail({
        from: `noreply@${MAIL_HOST}`,
        to: user.email,
        subject: 'Email Verification',
        text: 'Email Verification',
        html: `<div><h1>Click button to verify</h1><a href="${verificationLink}">Verify</a></div>`,
    });
};
