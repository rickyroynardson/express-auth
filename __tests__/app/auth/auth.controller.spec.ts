import supertest from 'supertest';
import app from '../../../src/app';
import prisma from '../../../src/db';

describe('POST /api/auth/register', () => {
    beforeAll(async () => {
        // delete example user if exists
        await prisma.user.delete({
            where: {
                email: 'example@mail.com',
            },
        });
    });

    it('should be able to register a new user', async () => {
        const response = await supertest(app)
            .post('/api/auth/register')
            .send({ email: 'example@mail.com', password: 'password', confirmPassword: 'password' });

        expect(response.status).toBe(201);
    });

    it('should not be able to register user with existing email', async () => {
        const response = await supertest(app).post('/api/auth/register').send({
            email: 'example@mail.com',
            password: 'password',
            confirmPassword: 'password',
        });

        expect(response.status).toBe(400);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe('Email already exists');
    });

    it('should not be able to register if confirmation password invalid', async () => {
        const response = await supertest(app).post('/api/auth/register').send({
            email: 'anotherexample@mail.com',
            password: 'password',
            confirmPassword: 'passwor',
        });

        expect(response.status).toBe(400);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe('Password confirmation not match');
    });
});
