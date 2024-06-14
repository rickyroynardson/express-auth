import dotenv from 'dotenv';
dotenv.config();

export const NODE_ENV: string = process.env.NODE_ENV as string;
export const CLIENT_URL: string = process.env.CLIENT_URL as string;
export const PORT: number = Number(process.env.PORT) || 4000;
export const JWT_ACCESS_SECRET: string = process.env.JWT_ACCESS_SECRET as string;
export const JWT_REFRESH_SECRET: string = process.env.JWT_REFRESH_SECRET as string;
export const JWT_VERIFY_SECRET: string = process.env.JWT_VERIFY_SECRET as string;
export const MAIL_HOST: string = process.env.MAIL_HOST as string;
export const MAIL_PORT: number = Number(process.env.MAIL_PORT);
export const MAIL_USER: string = process.env.MAIL_USER as string;
export const MAIL_PASS: string = process.env.MAIL_PASS as string;
