import prisma from '../db';
import { hash } from './hash';

export const createExampleUser = async () => {
    await prisma.user.create({
        data: {
            email: 'example@mail.com',
            password: await hash('password'),
        },
    });
};

export const deleteExampleUser = async () => {
    await prisma.user.delete({
        where: {
            email: 'example@mail.com',
        },
    });
};
