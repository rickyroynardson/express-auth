import prisma from '../../db';
import { hash } from '../../utils/hash';
import { RegisterType } from './auth.type';

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
