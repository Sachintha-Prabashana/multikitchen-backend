import { verifyAccessToken } from '../utils/jwtUtils.js';
import { sendError } from '../utils/responseHandler.js';

export const authMiddleware = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) return sendError(res, 'Access denied. No token provided.', 401);

  try {
    const decoded = verifyAccessToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    sendError(res, 'Invalid or expired token.', 401);
  }
};

export const isAdmin = (req, res, next) => {
  if (req.user.role !== 'ADMIN') return sendError(res, 'Access denied. Admins only.', 403);
  next();
};

export const isOwner = (req, res, next) => {
  if (req.user.role !== 'OWNER') return sendError(res, 'Access denied. Owners only.', 403);
  next();
};

export const isAdminOrOwner = (req, res, next) => {
  if (req.user.role !== 'ADMIN' && req.user.role !== 'OWNER') {
    return sendError(res, 'Access denied. Admins or Owners only.', 403);
  }
  next();
};
