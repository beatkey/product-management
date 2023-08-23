import dotenv from "dotenv";

dotenv.config({
    path: "./.env"
})
import mongoose from "mongoose";
import User from "./src/models/user.js";

const DB_URL = process.env.DB_URL

async function setup() {
    try {
        mongoose.connect(DB_URL)
        const data = await User.exists({
            email: "test@gmail.com"
        })
        if (!data) {
            await User.create({
                name: "Test",
                username: "test",
                email: "test@gmail.com",
                password: "$2a$12$b3E4rDIOfV1Crw/eAs5uheI.nru11IrSa1alzCoewixzYQi037AOi"
            })

            console.log('Test user created');
        }
    } catch (error) {
        console.error(error);
    } finally {
        mongoose.disconnect();
    }
}

setup();