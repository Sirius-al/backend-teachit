import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { promisify } from 'util';
import UserModel from './schemas/user.schema';

const getUser = async (req: Request, res: Response, next: NextFunction) => { 
    try {

        //@ts-ignore
        req.user.password = undefined

        // console.log('getUser => ', req.user)
        res.status(200).json({ success: true, user: req.user })
        
    } catch (err) {
        res.status(422).json({ success: false, msg: 'User not found' })
        console.log(`getUser error=> `, err)
    }
}


const getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const users = await UserModel.find().select('-password')

        res.status(200).json({ success: true, users })

    } catch (err) {
        res.status(500).json({ success: false, msg: 'Something went wrong', error: err })
        console.log(err)
    }

}


const getUserByToken = async (req: Request, res: Response, next: NextFunction) => {
    const { token } = req.body;
    
    try {
        let decoded

        try {
            // @ts-ignore
            decoded = await promisify(jwt.verify)(token, `${process.env.JWT_SECRET}`)
        } catch (err) {
            return res.status(401).json({ success: false, msg: `${err.message}. Please login again !` })
        }

        // @ts-ignore
        const user = await UserModel.findById(decoded.id)

        if (!user) {
            return res.status(404).json({ success: false, msg: 'User Not Found !' })
        }

        res.status(200).json({ success: true, user })

    } catch (err) {
        res.status(500).json({ success: false, msg: 'Something went wrong', error: err })
    }

}


const getUserById = async (req: Request, res: Response, next: NextFunction) => {
    const UserId = req.params.id

    try {
        const user = await UserModel.findById(UserId).select('-password')

        if (!user) {
            return res.status(404).json({ success: false, msg: 'User Not Found !' })
        }

        res.status(200).json({ success: true, user })
    } catch (err) {
        res.status(500).json({ success: false, msg: 'Something went wrong', error: err })
    }

}


const updateUserInterests = async (req: Request, res: Response, next: NextFunction) => {
    const UserId = req.params.id

    try {
        const ints = req.body.interests

        // console.log(ints)

        const user = await UserModel.findById(UserId)

        if (!user) {
            return res.status(404).json({ success: false, msg: 'User Not Found !' })
        }

        user.$set('interests', ints, { new: true })
        await user.save()

        res.status(201).json({ success: true, user })

    } catch (err) {
        res.status(500).json({ success: false, msg: 'Something went wrong', error: err })
    }

}


export default {
    getAllUsers,
    getUser,
    getUserById,
    updateUserInterests,
    getUserByToken
}