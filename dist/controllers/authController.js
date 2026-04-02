import * as authService from '../services/authService.js';
import { sendSuccess, sendError } from '../utils/responseHandler.js';
import { verifyRefreshToken, generateAccessToken } from '../utils/jwtUtils.js';
export const register = async (req, res) => {
    const { name, email, password, role } = req.body;
    const requesterRole = req.user.role;
    if (requesterRole === 'ADMIN' && role === 'OWNER') {
        return sendError(res, 'Admins cannot create Owners.', 403);
    }
    try {
        const user = await authService.registerUser(name, email, password, role);
        sendSuccess(res, 'User registered successfully', {
            id: user.user_id,
            name: user.name,
            email: user.email,
            role: user.role
        }, 201);
    }
    catch (error) {
        sendError(res, error.message || 'Registration failed');
    }
};
export const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const result = await authService.loginUser(email, password);
        // Standard role check can be triggered here if needed, but usually login is open.
        sendSuccess(res, 'Login successful', result);
    }
    catch (error) {
        const status = error.message === 'User not found' ? 404 : 401;
        sendError(res, error.message, status);
    }
};
export const refresh = async (req, res) => {
    const { refreshToken } = req.body;
    if (!refreshToken)
        return sendError(res, 'Refresh token required', 400);
    try {
        const decoded = verifyRefreshToken(refreshToken);
        const newAccessToken = generateAccessToken(decoded);
        sendSuccess(res, 'Token refreshed', { accessToken: newAccessToken });
    }
    catch (error) {
        sendError(res, 'Invalid refresh token', 401);
    }
};
export const updateProfile = async (req, res) => {
    const { name, email, password } = req.body;
    const userId = req.user.id;
    try {
        const user = await authService.updateUserProfile(userId, { name, email, password });
        sendSuccess(res, 'Profile updated successfully', {
            id: user.user_id,
            name: user.name,
            email: user.email,
            role: user.role
        });
    }
    catch (error) {
        sendError(res, error.message || 'Profile update failed');
    }
};
