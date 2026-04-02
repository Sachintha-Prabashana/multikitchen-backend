export const sendSuccess = (res, message, data = {}, status = 200) => {
  res.status(status).json({
    success: true,
    message,
    data
  });
};

export const sendError = (res, message, status = 400, errorCode = null) => {
  res.status(status).json({
    success: false,
    message,
    errorCode
  });
};
