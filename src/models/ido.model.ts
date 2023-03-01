import mongoose from "mongoose";
const Schema = mongoose.Schema;

const IDOSchema = new Schema({
    id: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
    symbol: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    contract: {
        type: String,
        required: true,
    },
}, { timestamps: true });

const IDO = mongoose.model("IDO", IDOSchema);
export default IDO;