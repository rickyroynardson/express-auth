import supertest from 'supertest';
import app from '../../../src/app';

describe('GET /api/health', () => {
    it('should return online status 200', async () => {
        const response = await supertest(app).get('/api/health');

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.message).toBe('Site is online');
        expect(response.body.data).toHaveProperty('status', 'online');
        expect(response.body.data).toHaveProperty('uptime');
    });
});

describe('GET /notfound', () => {
    it('should return not found status 404', async () => {
        const response = await supertest(app).get('/notfound');

        expect(response.status).toBe(404);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toBeDefined();
    });
});
