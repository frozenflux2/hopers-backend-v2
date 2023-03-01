import mongoose from "mongoose";
const Schema = mongoose.Schema;

const TokenSchema = new Schema({
    id: {
        type: String,
        requried: true
    },
    isNativeCoin: {
        type: Boolean,
        default: false
    },
    isIBCCoin: {
        type: Boolean,
        default: false
    },
    contractAddress: String,
    originChain: String,
    chain: {
        type: String,
        required: true
    },
    coinName: String,
    decimal: Number,
    denom: String,
    coingeckoId: String
}, { timestamps: true });

const Token = mongoose.model("Token", TokenSchema);
export default Token;