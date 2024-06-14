import { Response, Router } from 'express';
import { RequestWithUser } from '../auth/auth.middleware';
import { resFailed, resSuccess } from '../../utils/response';
import { getUserById } from '../user/user.service';

const profileController: Router = Router();

profileController.get('/', async (req: RequestWithUser, res: Response) => {
    try {
        const userId = req.user?.userId as string;
        const user = await getUserById(userId);
        return resSuccess(res, 200, 'Showing user profile', user);
    } catch (error: any) {
        return resFailed(res, 400, error.message);
    }
});

export default profileController;
