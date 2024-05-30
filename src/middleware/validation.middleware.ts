import { NextFunction, Request, Response } from 'express';
import { AnyZodObject, ZodError, ZodIssue } from 'zod';
import { resFailed } from '../utils/response';

export const validation = (schema: AnyZodObject) => async (req: Request, res: Response, next: NextFunction) => {
    try {
        req.body = await schema.parseAsync(req.body);
        next();
    } catch (error) {
        if (error instanceof ZodError) {
            const errors = error.errors.map((issue: ZodIssue) => ({ ...issue, message: `${issue.message} at '${issue.path}'` }));
            return resFailed(res, 422, 'Validation error', errors);
        }
        return resFailed(res, 500, 'Internal server error');
    }
};
