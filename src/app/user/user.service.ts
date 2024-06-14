import prisma from '../../db';

export const getUserById = async (userId: string) => {
    const user = await prisma.user.findUnique({
        where: {
            userId,
        },
        select: {
            userId: true,
            firstName: true,
            lastName: true,
            email: true,
            emailVerifiedAt: true,
            createdAt: true,
            updatedAt: true,
        },
    });

    if (!user) {
        throw new Error('User not found');
    }

    return user;
};
