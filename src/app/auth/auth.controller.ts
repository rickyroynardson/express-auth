import { Request, Response, Router } from 'express';
import { resFailed, resSuccess } from '../../utils/response';
import { validation } from '../../middleware/validation.middleware';
import { loginSchema, registerSchema } from './auth.schema';
import { login, refresh, register, resendVerificationEmail, verifyEmail } from './auth.service';
import { RequestWithUser, verifiedAccessToken } from './auth.middleware';

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

authController.post('/refresh', async (req: Request, res: Response) => {
    try {
        const authorizationHeader = req.headers.authorization;
        const refreshToken = req.cookies.refreshToken || authorizationHeader?.split(' ')[1];
        if (!refreshToken) {
            throw new Error('Token not found');
        }

        const accessToken = await refresh(refreshToken);

        return resSuccess(res, 200, 'Token refresh success', accessToken);
    } catch (error: any) {
        return resFailed(res, 400, error.message);
    }
});

authController.get('/verification', async (req: Request, res: Response): Promise<Response> => {
    try {
        await verifyEmail(req.query.token as string);
        return resSuccess(res, 200, 'Verification success');
    } catch (error: any) {
        return resFailed(res, 400, error.message);
    }
});

authController.post('/verification', verifiedAccessToken, async (req: RequestWithUser, res: Response): Promise<Response> => {
    try {
        await resendVerificationEmail(req.user?.userId as string);
        return resSuccess(res, 200, 'Verification email sent');
    } catch (error: any) {
        return resFailed(res, 400, error.message);
    }
});

export default authController;
