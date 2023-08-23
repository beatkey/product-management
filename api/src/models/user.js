import mongoose from "mongoose";

const schema = new mongoose.Schema({
    name: {
        required: true,
        type: String
    },
    username: {
        required: true,
        type: String
    },
    password: {
        required: true,
        type: String
    },
    email: {
        required: true,
        type: String
    }
}, {
    timestamps: true
})
export default mongoose.model("user", schema)
