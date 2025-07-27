export const ensureOTPVerified = (req, res, next) => {
  if (!req.session || !req.session.otpVerified) {
    return res.status(403).json({ message: "OTP verification required." });
  }
  next();
};
