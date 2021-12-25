import mongoose, { Schema, Types } from 'mongoose';
import { subCategory } from '../interfaces/admins.interfaces';

const subCategories: Schema = new Schema({
    name: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

const subCat = mongoose.model<subCategory>('subCategory', subCategories);
export default subCat;