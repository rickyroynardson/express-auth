import express, { Application, Response } from 'express';
import { resFailed } from './utils/response';
import healthController from './app/health/health.controller';
import authController from './app/auth/auth.controller';

const app: Application = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/health', healthController);
app.use('/api/auth', authController);

app.use((_, res: Response) => resFailed(res, 404, 'Not found, go /api'));

export default app;
