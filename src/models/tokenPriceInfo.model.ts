import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const TokenPriceInfoSchema = new Schema(
    {
        key: {
            type: String,
            required: true,
        },
        content: Object,
    },
    { timestamps: true },
);

const TokenPriceInfo = mongoose.model('TokenPriceInfo', TokenPriceInfoSchema);
export default TokenPriceInfo;
