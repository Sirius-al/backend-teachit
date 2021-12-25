//@ts-nocheck

import { NextFunction, Request, Response } from 'express';
import passport from 'passport';
import UserModel from '../_user/schemas/user.schema';
import './auth.service/passport';
import { promisify } from 'util';
import jwt from 'jsonwebtoken';
import { jwtSecret } from './../utils/configs';

export const localSignIn = passport.authenticate('local', { session: false })

/* export const authorize = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // * make sure the Bearer token exists !

        let token = req.headers.authorization
        let decoded

        console.log(token)

        if (!token) {
            return res.status(401).json({ success: false, msg: 'You are not Logged In, Please login to get access !' })
        }

        // * Verify the token

        try {
            decoded = await promisify(jwt.verify)(token, jwtSecret)
        } catch (err) {
            console.log('decoded => ', err)
            return res.status(401).json({ success: false, msg: `${err.message}. Please login again !` })
        }

        // * Check if the user exists


        const existingUser = await UserModel.findById(decoded.sub)

        if (!existingUser) {
            return res.status(401).json({ success: false, msg: 'user does not exist' })
        }

        // * Check if the user changed the pass after the jwt was issued

        if (existingUser.passChangedAt) {
            const changedPassTime = parseInt(existingUser.passChangedAt.getTime() / 1000);

            const changed = decoded.iat < changedPassTime //! false means the pass has not been changed after jwt was issued 

            if (changed) {
                return res.status(401).json({ success: false, msg: 'You recently changed your password.. Please login Again !' })
            }
        }

        // * If everything goes well go to the next midleware
        req.user = existingUser;
        next()

    } catch (err) {
        res.status(500).json({ success: false, msg: "from protected route" })
        console.log(err)
    }
} */



export const authorize = passport.authenticate('jwt', { session: false })
