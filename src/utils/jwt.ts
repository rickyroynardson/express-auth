import jwt from 'jsonwebtoken';
import { JWT_ACCESS_SECRET, JWT_REFRESH_SECRET, JWT_VERIFY_SECRET } from './config';

// access token
export const generateAccessToken = (payload: object): string => {
    return jwt.sign(payload, JWT_ACCESS_SECRET, { expiresIn: '8h' });
};

export const verifyAccessToken = (token: string) => {
    return jwt.verify(token, JWT_ACCESS_SECRET);
};

// refresh token
export const generateRefreshToken = (payload: object): string => {
    return jwt.sign(payload, JWT_REFRESH_SECRET, { expiresIn: '30d' });
};

export const verifyRefreshToken = (token: string) => {
    return jwt.verify(token, JWT_REFRESH_SECRET);
};

// verify token
export const generateVerifyToken = (payload: object): string => {
    return jwt.sign(payload, JWT_VERIFY_SECRET, { expiresIn: '5m' });
};

export const verifyVerifyToken = (token: string) => {
    return jwt.verify(token, JWT_VERIFY_SECRET);
};
