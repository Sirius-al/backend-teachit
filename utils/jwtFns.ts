import jwt from 'jsonwebtoken';
import { promisify } from 'util';

// @ts-ignore
export const signToken = (user) => {
    const date = new Date().getTime()

    const payload = {
        sub: user._id,
        iat: date
    }

    return jwt.sign(payload, `${process.env.JWT_SECRET}`, {
        expiresIn: process.env.JWT_EXP
    })
}


export const verifyToken = (token: string) => {
    return jwt.verify(token, `${process.env.JWT_SECRET}`)
}