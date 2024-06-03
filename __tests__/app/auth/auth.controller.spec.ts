import supertest from 'supertest';
import app from '../../../src/app';
import { createExampleUser, deleteExampleUser } from '../../../src/utils/jest';

describe('POST /api/auth/register', () => {
    afterAll(async () => {
        await deleteExampleUser();
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

describe('POST /api/auth/login', () => {
    beforeAll(async () => {
        await createExampleUser();
    });

    afterAll(async () => {
        await deleteExampleUser();
    });

    it('should be able to login', async () => {
        const response = await supertest(app).post('/api/auth/login').send({ email: 'example@mail.com', password: 'password' });

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.message).toBe('Login success');
        expect(response.body.data.user).toHaveProperty('userId');
        expect(response.body.data.user).toHaveProperty('firstName');
        expect(response.body.data.user).toHaveProperty('lastName');
        expect(response.body.data.user).toHaveProperty('email', 'example@mail.com');
        expect(response.body.data.user).toHaveProperty('emailVerifiedAt');
        expect(response.body.data.accessToken).toBeDefined();
        expect(response.body.data.refreshToken).toBeDefined();
    });

    it('should not be able to login with invalid user', async () => {
        const response = await supertest(app).post('/api/auth/login').send({
            email: 'wronguser@mail.com',
            password: 'wrongpass',
        });

        expect(response.status).toBe(400);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe('Invalid credentials');
    });

    it('should not be able to login with invalid credentials', async () => {
        const response = await supertest(app).post('/api/auth/login').send({
            email: 'example@mail.com',
            password: 'wrongpass',
        });

        expect(response.status).toBe(400);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe('Invalid credentials');
    });
});
