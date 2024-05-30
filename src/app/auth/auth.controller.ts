import { Request, Response, Router } from 'express';
import { resFailed, resSuccess } from '../../utils/response';
import { validation } from '../../middleware/validation.middleware';
import { registerSchema } from './auth.schema';
import { register } from './auth.service';

const authController: Router = Router();

authController.post('/register', validation(registerSchema), async (req: Request, res: Response): Promise<Response> => {
    try {
        const newUser = await register(req.body);
        return resSuccess(res, 201, 'Register success', newUser);
    } catch (error: any) {
        return resFailed(res, 400, error.message);
    }
});

export default authController;
