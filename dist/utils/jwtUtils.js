import jwt from 'jsonwebtoken';
import 'dotenv/config';
const ACCESS_TOKEN_SECRET = process.env.JWT_SECRET || 'access_secret';
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || 'refresh_secret';
export const generateAccessToken = (user) => {
    return jwt.sign({
        id: user.user_id || user.id,
        email: user.email,
        role: user.role
    }, ACCESS_TOKEN_SECRET, { expiresIn: '30m' });
};
export const generateRefreshToken = (user) => {
    return jwt.sign({
        id: user.user_id || user.id,
        email: user.email,
        role: user.role
    }, REFRESH_TOKEN_SECRET, { expiresIn: '7d' });
};
export const verifyAccessToken = (token) => {
    return jwt.verify(token, ACCESS_TOKEN_SECRET);
};
export const verifyRefreshToken = (token) => {
    return jwt.verify(token, REFRESH_TOKEN_SECRET);
};
