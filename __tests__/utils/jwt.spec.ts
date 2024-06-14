import {
    generateAccessToken,
    generateRefreshToken,
    generateVerifyToken,
    verifyAccessToken,
    verifyRefreshToken,
    verifyVerifyToken,
} from '../../src/utils/jwt';

describe('JWT Tokens', () => {
    it('should generate and verify access token', () => {
        const payload = { id: 1 };
        const accessToken = generateAccessToken(payload);
        const decodedToken = verifyAccessToken(accessToken);

        expect(accessToken).toBeDefined();
        expect(decodedToken).toHaveProperty('id', 1);
    });

    it('should generate and verify refresh token', () => {
        const payload = { id: 1 };
        const refreshToken = generateRefreshToken(payload);
        const decodedToken = verifyRefreshToken(refreshToken);

        expect(refreshToken).toBeDefined();
        expect(decodedToken).toHaveProperty('id', 1);
    });

    it('should generate and verify verify token', () => {
        const payload = { id: 1 };
        const verifyToken = generateVerifyToken(payload);
        const decodedToken = verifyVerifyToken(verifyToken);

        expect(verifyToken).toBeDefined();
        expect(decodedToken).toHaveProperty('id', 1);
    });
});
