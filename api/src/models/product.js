import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate";

const schema = new mongoose.Schema({
    name: {
        required: true,
        type: String
    },
    desc: {
        required: true,
        type: String
    },
    code: {
        required: true,
        type: String
    },
    stock: {
        required: true,
        type: Number
    },
}, {
    timestamps: true
})

schema.plugin(mongoosePaginate);
export default mongoose.model("product", schema)
