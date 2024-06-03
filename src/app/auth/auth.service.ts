import prisma from '../../db';
import { compare, hash } from '../../utils/hash';
import { generateAccessToken, generateRefreshToken } from '../../utils/jwt';
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
