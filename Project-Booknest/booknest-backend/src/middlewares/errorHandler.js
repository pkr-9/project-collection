export const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode ? res.statusCode : 500; // Set default status code to 500 if not set
  res.status(statusCode);

  console.error(`[ERROR] ${err.stack}`); // Log the stack trace for debugging

  // Send the error response
  res.json({
    message: err.message, // Send the error message
    stack: process.env.NODE_ENV === "production" ? null : err.stack, // Hide stack trace in production
  });
};
