import { Request, Response, Router } from 'express';
import { resFailed, resSuccess } from '../../utils/response';
import { validation } from '../../middleware/validation.middleware';
import { loginSchema, registerSchema } from './auth.schema';
import { login, register } from './auth.service';

const authController: Router = Router();

authController.post('/register', validation(registerSchema), async (req: Request, res: Response): Promise<Response> => {
    try {
        const newUser = await register(req.body);
        return resSuccess(res, 201, 'Register success', newUser);
    } catch (error: any) {
        return resFailed(res, 400, error.message);
    }
});

authController.post('/login', validation(loginSchema), async (req: Request, res: Response): Promise<Response> => {
    try {
        const credentials = await login(req.body);
        res.cookie('refreshToken', credentials.refreshToken, {
            httpOnly: true,
            maxAge: 30 * 24 * 60 * 60 * 1000,
        });
        return resSuccess(res, 200, 'Login success', credentials);
    } catch (error: any) {
        return resFailed(res, 400, error.message);
    }
});

export default authController;
