import OTP from "../models/otp.model.js";

export const generateOTP = async (email) => {
  const now = new Date();
  const throttleWindow = new Date(now.getTime() - 1 * 60 * 1000); // 1 minute ago

  const recent = await OTP.findOne({
    email,
    createdAt: { $gte: throttleWindow },
  });
  if (recent) {
    throw new Error(
      "OTP recently sent. Please wait before requesting a new one."
    );
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = new Date(now.getTime() + 5 * 60 * 1000);

  await OTP.findOneAndUpdate(
    { email },
    { email, otp, expiresAt },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  return otp;
};

export const verifyStoredOTP = async (email, otp) => {
  const record = await OTP.findOne({ email });
  if (!record) return { status: false, reason: "not_found" };
  if (record.expiresAt < new Date()) {
    await OTP.deleteOne({ email });
    return { status: false, reason: "expired" };
  }
  const isValid = record.otp === otp;
  if (isValid) await OTP.deleteOne({ email });
  return { status: isValid, reason: isValid ? "valid" : "invalid" };
};
