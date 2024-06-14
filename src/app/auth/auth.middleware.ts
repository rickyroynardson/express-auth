import { NextFunction, Request, Response } from 'express';
import { resFailed } from '../../utils/response';
import { verifyAccessToken } from '../../utils/jwt';
import { JwtPayload } from 'jsonwebtoken';

export interface RequestWithUser extends Request {
    user?: {
        userId: string;
    };
}

export const verifiedAccessToken = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    const authorizationHeader = req.headers.authorization;
    if (!authorizationHeader) {
        return resFailed(res, 401, 'Unauthorized');
    }

    const token = authorizationHeader.split(' ')[1];
    try {
        const decodedToken = verifyAccessToken(token);
        req.user = {
            userId: (decodedToken as JwtPayload).userId,
        };
        next();
    } catch (error: any) {
        return resFailed(res, 401, 'Unauthorized');
    }
};
