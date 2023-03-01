import mongoose from "mongoose";
const Schema = mongoose.Schema;

const BidsSchema = new Schema({
    key: {
        type: String,
        required: true
    },
    content: Object
}, { timestamps: true });

const Bids = mongoose.model("Bids", BidsSchema);
export default Bids;