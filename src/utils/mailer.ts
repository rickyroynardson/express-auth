import { createTransport } from 'nodemailer';
import { MAIL_HOST, MAIL_PASS, MAIL_PORT, MAIL_USER } from './config';

export const transporter = createTransport({
    host: MAIL_HOST,
    port: MAIL_PORT,
    auth: {
        user: MAIL_USER,
        pass: MAIL_PASS,
    },
});
