import { Document } from 'mongoose';

export interface Category extends Document {
    _id: number;
    name: string;
    subCategories: number[];
}

export interface subCategory extends Document {
    _id: number;
    name: string;
}