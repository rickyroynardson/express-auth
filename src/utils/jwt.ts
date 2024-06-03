import jwt from 'jsonwebtoken';
import { JWT_ACCESS_SECRET, JWT_REFRESH_SECRET } from './config';

// access token
export const generateAccessToken = (payload: object): string => {
    return jwt.sign(payload, JWT_ACCESS_SECRET, { expiresIn: '8h' });
};

export const verifyAccessToken = (token: string): object | string | undefined => {
    return jwt.verify(token, JWT_ACCESS_SECRET);
};

// refresh token
export const generateRefreshToken = (payload: object): string => {
    return jwt.sign(payload, JWT_REFRESH_SECRET, { expiresIn: '30d' });
};

export const verifyRefreshToken = (token: string): object | string | undefined => {
    return jwt.verify(token, JWT_REFRESH_SECRET);
};
