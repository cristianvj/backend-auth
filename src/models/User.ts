import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  email: string;
  name: string;
  password: string;
  role: string;
  confirmed: boolean;
};

const UserSchema: Schema = new Schema({
    email: { 
      type: String, 
      required: true,
      lowercase: true,
      trim: true,
      unique: true,
    },
    password: { 
      type: String, 
      required: true, 
      trim: true, 
    },
    name: { 
      type: String, 
      required: true,
      trim: true, 
    },
    confirmed: { 
      type: Boolean,
      default: false
    }
});

export default mongoose.model<IUser>('User', UserSchema);