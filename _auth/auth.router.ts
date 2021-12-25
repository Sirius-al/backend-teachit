import express from 'express';
import authController from './auth.controller';
import { localSignIn } from './auth.middleware';

const authRouter = express.Router();

// ---> All Auth Related Routers 
// --> Register

//? TESTING ROUTE
// authRouter.route('/test').get(protectedRoute)

//? Route:    POST => /auth/register-phone
//? Desc:     create user by unique phone number
//? access:   Public
authRouter.route('/register-phone').post(authController.registerUserByPhoneOrEmail)

//? Route:    POST => /auth/update-phone-email
//? Desc:     update phone number or email address
//? access:   Public
authRouter.route('/update-phone-email').post(authController.updatePhoneOrEmail)

//? Route:    POST => /auth/confirm-otp
//? Desc:     Validate phone number by sending otp
//? access:   Public
authRouter.route('/confirm-otp').post(authController.otpVerification)

//? Route:    POST => /auth/resend-otp
//? Desc:     Resend otp to the phone number ( IF something wents wrong while sending otp, the saved user will be deleted from the db )
//? access:   Public
authRouter.route('/resend-otp').post(authController.resendOtp)

//? Route:    POST => /auth/register
//? Desc:     update user by the previously saved phone number to ( db & cache )
//? access:   Public
authRouter.route('/register').post(authController.registerUser)

//? Route:    POST => /auth/login
//? Desc:     Login Users
//? access:   Private
authRouter.route('/login').post(authController.login)


export default authRouter;