import express, { Application, Response } from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { resFailed } from './utils/response';
import { CLIENT_URL } from './utils/config';
import healthController from './app/health/health.controller';
import authController from './app/auth/auth.controller';
import profileController from './app/profile/profile.controller';
import { verifiedAccessToken } from './app/auth/auth.middleware';

const app: Application = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({ origin: CLIENT_URL, credentials: true }));

app.use('/api/health', healthController);
app.use('/api/auth', authController);
app.use('/api/profile', verifiedAccessToken, profileController);

app.use((_, res: Response) => resFailed(res, 404, 'Not found, go /api'));

export default app;
