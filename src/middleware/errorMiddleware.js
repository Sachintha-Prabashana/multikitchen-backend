import { sendError } from '../utils/responseHandler.js';

export const errorMiddleware = (err, req, res, next) => {
  console.error(err.stack);
  
  const status = err.status || 500;
  const message = err.message || 'Internal Server Error';
  
  sendError(res, message, status, err.code || 'INTERNAL_ERROR');
};
