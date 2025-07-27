import bcrypt from "bcryptjs";

// Hash the password (to be used with pre-save hook)
export const hashPasswordHook = async function (next) {
  if (!this.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
};

// Compare password (method for model)
export const comparePasswordMethod = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};
