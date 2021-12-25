import { Document } from 'mongoose';

export interface IUser {
    fullName: string;
    phone: string | null;
    email: string;
    role: string;
    password?: string;
    interests?: any;
}

export interface IUserDoc extends Document {
    fullName: string;
    phone: string | null;
    email: string;
    role: string;
    password: string;
    interests: any;
    passChangedAt?: string;
}