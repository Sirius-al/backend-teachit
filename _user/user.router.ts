import express from 'express';
import { authorize } from '../_auth/auth.middleware';
import userController from './user.controller';


const userRouter = express.Router();

// ---> All User Related Routers 

//? Route:    GET => /user/
//? Desc:     get dumb user
//? access:   Private
userRouter.route('/').get(authorize, userController.getAllUsers)

//? Route:    GET => /user/get-token-user
//? Desc:     protected get by token
//? access:   Private
userRouter.route('/get-token-user').post(userController.getUserByToken)

//? Route:    GET => /user/getUser
//? Desc:     get dumb user
//? access:   Public
userRouter.route('/getUser').get(authorize, userController.getUser)


//? Route:    GET => /user/:id6055e6c7f0369c3c286739d4
//? Desc:     get user by id
//? access:   Public
userRouter.route('/:id').get(userController.getUserById)


//? Route:    Patch => /user/interests/:id6055e6c7f0369c3c286739d4
//? Desc:     create user's interests
//? access:   Public
userRouter.route('/interests/:id').patch(userController.updateUserInterests)


export default userRouter;