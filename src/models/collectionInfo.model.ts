import mongoose from "mongoose";
const Schema = mongoose.Schema;

const CollectionInfoSchema = new Schema({
    key: {
        type: String,
        required: true
    },
    content: Object
}, { timestamps: true });

const CollectionInfo = mongoose.model("CollectionInfo", CollectionInfoSchema);
export default CollectionInfo;