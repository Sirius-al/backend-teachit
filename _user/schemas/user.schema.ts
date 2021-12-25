//@ts-nocheck
import mongoose, { Schema } from 'mongoose';
import validator from 'validator';
import { IUserDoc } from '../interfaces/userInterface';
import bcrypt from 'bcryptjs';

const UserSchema: Schema = new Schema({
    fullName: {
        type: String,
        // required: [true, 'Plase insert full-name']
    },
    username: {
        type: String,
        // required: [true, 'Plase insert full-name']
    },
    gender: {
        type: String,
        // required: [true, 'Plase insert full-name']
    },
    education: {
        type: String,
    },
    profilePic: {
        type: String,
    },
    institution: {
        type: String,
    },
    socials: [
        {
            name: String,
            link: String
        }
    ],
    phone: {
        type: String,
        lowercase: true,
        // match: [
        //     /^(?:\+?88)?01[15-9]\d{8}$/,
        //     'Please insert a valid phone number'
        // ]
    },
    email: {
        type: String,
        lowercase: true,
        // required: true,
        // match: [
        //     /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        //     'Please add a valid email'
        // ],
        validate: [validator.isEmail, 'Please add a valid email']
    },
    role: {
        type: String,
        enum: ['student', 'teacher', 'admin'],
        default: 'student'
    },
    password: {
        type: String,
        // required: [true, 'Please add a password'],
        minlength: 8,
    },
    interests: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'interests'
    },
    passChangedAt: Date,
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    createdAt: {
        type: Date,
        default: Date.now
    }
},
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    });

//* Populating user's data with the selected interests
/* UserSchema.pre(/^find/, function (next) {
    this.populate({
        path: 'InterestModel',
        select: 'text'
    })
    
    next()
}) */


//* Check for correct Password
UserSchema.methods.correctPassword = function (uiPass: string, callback: Function) {

     bcrypt.compare(uiPass, this.password, function(err, isMatch) {
        if (err) { return callback(err) }

        callback(null, isMatch)
    })
}

const UserModel = mongoose.model<IUserDoc>('UserModel', UserSchema);
export default UserModel;