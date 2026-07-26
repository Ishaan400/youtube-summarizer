import mongoose, { Schema, Model } from 'mongoose';

export interface IUser {
  email: string;
  password: string;
  createdAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: false }
);

const User: Model<IUser> =
  mongoose.models.User ?? mongoose.model<IUser>('User', userSchema);

export default User;
