import dotenv from 'dotenv';
dotenv.config();

export const CLIENT_URL: string = process.env.CLIENT_URL as string;
export const PORT: number = Number(process.env.PORT) || 4000;
export const JWT_ACCESS_SECRET: string = process.env.JWT_ACCESS_SECRET as string;
export const JWT_REFRESH_SECRET: string = process.env.JWT_REFRESH_SECRET as string;
