import { Schema, model } from 'mongoose';
import { IUser } from '../types/models';

const userSchema = new Schema<IUser>({
  name: { type: String, default: null },
  email: { type: String, require: true, unique: true },
  password: { type: String, require: true },
  token: { type: String, require: true }
});

module.exports = model<IUser>('User', userSchema);