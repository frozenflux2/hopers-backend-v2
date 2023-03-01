import mongoose from "mongoose";
const Schema = mongoose.Schema;

const LiquiditySchema = new Schema({
    tokenA: {
        type: String,
        required: true,
    },
    tokenB: {
        type: String,
        required: true,
    },
    contractAddress: {
        type: String,
        required: true,
    },
    stakingAddress: {
        type: mongoose.Schema.Types.Mixed,
        default: "",
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
}, { timestamps: true });

const Liquidity = mongoose.model("Liquidity", LiquiditySchema);
export default Liquidity;