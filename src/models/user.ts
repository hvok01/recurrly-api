import mongoose, { Document, Schema } from "mongoose";
import crypto from "crypto";

export interface IUser extends Document {
  name: string;
  setPassword: (password: string) => void;
  validatePassword: (password: string) => void;
}

const UserSchema: Schema = new Schema({
  name: { type: String, required: true },
  passwordHash: { type: String, required: true },
  passwordSalt: { type: String, required: true },
});

UserSchema.methods.setPassword = function (password: string) {
  this.passwordSalt = crypto.randomBytes(16).toString();

  this.passwordHash = crypto
    .pbkdf2Sync(password, this.passwordSalt, 1000, 64, "sha512")
    .toString("hex");

  return;
};

UserSchema.methods.validatePassword = function (password: string) {
  const hash = crypto
    .pbkdf2Sync(password, this.passwordSalt, 1000, 64, "sha512")
    .toString("hex");

  return this.passwordHash === hash;
};

export default mongoose.model<IUser>("User", UserSchema);
