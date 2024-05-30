import { z } from 'zod';

export const registerSchema = z.object({
    email: z
        .string()
        .email()
        .transform((value) => value.toLowerCase()),
    password: z.string().min(8),
    confirmPassword: z.string(),
});
