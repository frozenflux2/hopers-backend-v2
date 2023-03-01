import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const IdoInfoSchema = new Schema(
    {
        key: {
            type: String,
            required: true,
        },
        content: Object,
    },
    { timestamps: true },
);

const IdoInfo = mongoose.model('IdoInfo', IdoInfoSchema);
export default IdoInfo;
