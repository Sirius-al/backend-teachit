import mongoose, { Schema, Types } from 'mongoose';
import { Category } from '../interfaces/admins.interfaces';

const categorySchema: Schema = new Schema({
    name: {
        type: String,
        unique: true
    },
    subCategories: [
        {// @ts-ignore
            type: mongoose.Schema.ObjectId,
            ref: 'subCategory',
            default: []
        }
    ],
    createdAt: {
        type: Date,
        default: Date.now
    }
}, 
{ 
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
})

const Category = mongoose.model<Category>('categories', categorySchema);
export default Category;