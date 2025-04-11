import mongoose from 'mongoose';
import dotenv from 'dotenv';

const Connection=() => {
    dotenv.config();
    const URL = process.env.MONGODB_URL;

    mongoose.connect(URL).then(() => {
        console.log("MongoDB connected successfully");
    }).catch((err => {
        console.log("Error connecting MongoDB ", err);
    }));
}

export default Connection;