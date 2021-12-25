import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import express from 'express';
import logger from 'morgan';
import cors from 'cors';
import colors from 'colors';
import InterestModel from './_admin/schemas/interest.schema';


import { connectDB } from './db/db';
import authRouter from './_auth/auth.router';
import userRouter from './_user/user.router';
import adminRouter from './_admin/admin.router';
import courseRouter from './_course/course.router';

//! ---> Default variables
const Port = process.env.PORT || 8000

// ---> Initial Setup
const app = express();
var corsOptions = {
    // "Access-Control-Allow-Origin": '*',
    origin: [`http://localhost:3000`, `https://teach-it-iota.vercel.app`],
    optionsSuccessStatus: 200
}

dotenv.config();
//* setting up CORS
app.use(cors(corsOptions));

// ---> Middleware Setup
app.use(logger('dev'));
app.use(express.json({type: '*/*'}));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// ---> Router Middleware Setup
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/user', userRouter);
app.use('/api/v1/data', adminRouter);
app.use('/api/v1/course', courseRouter);

app.get('/', async (req, res) => {

    const dbCall = await InterestModel.find();

    if (dbCall.length) {
        res.status(200).json({
            data: "server running...",
            db: dbCall
        })
    } else {
        res.status(200).json({
            data: "server running...",
            db: "not connected !"
        })
    }
});


// ----> Connect with DB
connectDB();

// ---> Server Listener
app.listen(Port, () => {
    console.log(colors.cyan(`App listening at port:${Port}`))
})

