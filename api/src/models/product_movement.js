import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate";

const schema = new mongoose.Schema({
    product_id: {
        required: true,
        type: String
    },
    desc: {
        required: true,
        type: String
    },
    amount: {
        required: true,
        type: Number
    },
    type: {
        required: true,
        type: String
    }

}, {
    timestamps: true
})

schema.plugin(mongoosePaginate);

export default mongoose.model("product_movement", schema)
