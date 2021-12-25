// @ts-nocheck

import bcrypt from 'bcryptjs';
import { NextFunction, Request, Response } from 'express';
import { signToken } from '../utils/jwtFns';
import UserModel from '../_user/schemas/user.schema';
import { getClientAsync, setExpClientAsync } from './../utils/RedisClient';


//! ****************************** default functions

const setOtp = async function () {
    await setExpClientAsync('OTP', 5 * 60, '1234')
}

//! ****************************** Middlewares
const registerUserByPhoneOrEmail = async (req: Request, res: Response, next: NextFunction) => {
    const { phone, email, password } = req.body

    const sendOTP = async (type, value) => {
        const existedUser = await UserModel.findOne(value);
        
        if (existedUser) {
            //? saving otp to redis for 5 minutes
            setOtp()
            
            return res.status(200).json({ success: true, msg: 'An otp has Been sent to your Phone Number !' })
        }

        const hashedPass = await bcrypt.hash(password, 12)
        
        const obj = {
            password: hashedPass
        }
        
        if (type == 'phone') {
            obj.phone = value.phone
        } else {
            obj.email = value.email
        }
        
        await UserModel.create(obj);
        

        //? saving otp to redis for 5 minutes
        setOtp()
        
        res.status(201).json({ success: true, msg: 'An otp has Been sent to your Phone Number !' })
    }
    
    try {
        
        if (phone) {
            sendOTP("phone", {phone})
        }
        
        if (email) {
            sendOTP("email", {email})
        }


    }
    catch (error) {
        console.error(error);
        res.status(500).json({ success: false, msg: error.message })
    }
}

const otpVerification = async (req: Request, res: Response, next: NextFunction) => {

    try {
        const otp = req.body.otp
        const otpFromRedis = await getClientAsync('OTP')

        if (!otpFromRedis) {
            return res.status(400).json({
                success: false,
                msg: 'You have taken too much time to respond ! Get another Otp by clicking Resend OTP'
            })
        }


        switch (otp) {

            case false || otp.length < 3:
                return res.status(200).json({ success: false, msg: 'Invalid OTP !' })

            case otpFromRedis:
                res.status(200).json({ success: true, msg: 'OTP is correct !' })
                break;

            default:
                return res.status(400).json({ success: false, msg: 'Incorrect otp !' })
        }

    }
    catch (error) {
        res.status(500).json({ success: false, msg: error.message })
        console.error('otpVerification middleware', error);
    }
}

const updatePhoneOrEmail = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, phone } = req.body;

        const userEmail = await UserModel.findOne({ email });
        const userPhone = await UserModel.findOne({ phone });
        
        if ( !userEmail && !userPhone ) {
            return res.status(422).json({ success: false, msg: 'User does not exist !' })
        }
        
        console.log(req.body)

        if (userEmail) {
            userEmail.phone = phone
            await userEmail.save()

            return res.status(200).json({ success: true, msg: "Phone number updated Successfully." })
        }
        
        if (userPhone) {
            userPhone.email = email
            await userPhone.save()

            return res.status(200).json({ success: true, msg: "Email updated Successfully." })
        }

        res.status(400).json({ success: false, msg: "Bad Request" })
    }
    catch (error) {
        console.error(error.message);
        res.status(500).json({ success: false, msg: error.message })
    }
}

const registerUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { fullName, email, phone, socials, username, gender, role, education, institution } = req.body;

        
        // if ( !email || !password ) {
        //     return res.status(422).json({ success: false, msg: 'email and password are required !' })
        // }
        
        console.log(req.body)

        const userEmail = await UserModel.findOne({ email });
        const userPhone = await UserModel.findOne({ phone });

        if (!userEmail && !userPhone) {
            return res.status(422).json({ success: false, msg: 'user with this email or phone number does not exists !' })
        }

        // let savedPhoneNumber = await getClientAsync('userPhoneNum')

        try {
            const obj = { fullName, username, socials, gender, role, education, institution }

            console.log(obj)

            if (userEmail._id) {
                const updatedUser = await UserModel.findOneAndUpdate(
                    { email },
                    { $set: obj },
                    { new: true }
                );
                return res.status(200).json({ success: true, msg: "User Registered Successfully.", user: updatedUser._id })
            }
            
            if (userPhone._id) {
                const updatedUser = await UserModel.findOneAndUpdate(
                    { phone: phone },
                    { $set: obj },
                    { new: true }
                    );
                    
                return res.status(200).json({ success: true, msg: "User Registered Successfully.", user: updatedUser._id })
            }


            console.log(req.body)
            res.status(401).json({ success: false, msg: "User Registration failed, please try again !" })

        } catch (err) {
            console.log('registerUser', err)
            res.status(500).json({ success: false, msg: error.message })
        }
    }
    catch (error) {
        console.error(error.message);
        res.status(500).json({ success: false, msg: error.message })
    }
}

const resendOtp = async (req: Request, res: Response, next: NextFunction) => {
    const phoneNumberFromRedis = await getClientAsync('userPhoneNum')

    try {
        //? saving otp to redis for 5 minutes
        setOtp()

        res.status(200).json({ success: true, msg: 'Another otp has Been sent to your Phone Number !' })

    } catch (err) {
        await UserModel.findOneAndRemove({ phone: phoneNumberFromRedis })
        res.status(500).json({ success: false, msg: 'something went wrong.. Please Reload the page and try again !' })
        console.log('resendOtp', err)
    }
}


const login = async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;

    
    // {testEmail: "nafaldin@gmail.com", testPass: "siriusal121211@5372"}
    
    try {

        const user = await UserModel.findOne({ email })
        // console.log({req: req.body, user})
        
        if (!user) {
            return res.status(404).json({ success: false, msg: 'user not found !' })
        }

        user.correctPassword(password, (err, isMatch) => {
            if (err) { return res.status(400).json({ success: false, msg: 'validation failed', error: err }) }
            if (!isMatch) { return res.status(400).json({ success: false, msg: 'invalid credentials' }) }


            const token = signToken(user)
    
            res.status(200).json({ success: true, token })
        })
    } catch (err) {
        res.status(500).json({ success: false, msg: 'Authentication failed' })
        console.error(err);
    }
}

export default {
    resendOtp,
    registerUserByPhoneOrEmail,
    updatePhoneOrEmail,
    otpVerification,
    registerUser,
    login,
}