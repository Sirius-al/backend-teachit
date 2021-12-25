import colors from 'colors';
import mongoose from 'mongoose';

export const connectDB = async () => {
    try {
        const url: string = process.env.MONGODB_URL as string;
        const connection = await mongoose.connect(url, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
            useFindAndModify: false
        });
        if (connection) {
            console.log(colors.cyan("DB connected successfully"))
        }
    }
    catch (error) {
        console.error(error)
    }
}