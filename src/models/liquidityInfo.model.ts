import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const LiquidityInfoSchema = new Schema(
    {
        id: {
            type: Number,
            required: true,
        },
        token1: {
            type: String,
            required: true,
        },
        token2: {
            type: String,
            required: true,
        },
        token1Reserve: {
            type: Number,
            required: true,
        },
        token2Reserve: {
            type: Number,
            required: true,
        },
        isVerified: {
            type: Boolean,
            default: false,
        },
        apr: {
            type: mongoose.Schema.Types.Mixed,
            required: true,
        },
        contract: {
            type: String,
            required: true,
        },
        lpAddress: {
            type: String,
            required: true,
        },
        stakingAddress: mongoose.Schema.Types.Mixed,
        pool: {
            type: Number,
            required: true,
        },
        ratio: {
            type: Number,
            required: true,
        },
        poolCreated: {
            type: String,
            required: true,
        },
        poolUpdated: {
            type: String,
            required: true,
        },
        volume: Number,
        earned: Number,
        balance: Number,
        config: mongoose.Schema.Types.Mixed,
    },
    { timestamps: true },
);

const LiquidityInfo = mongoose.model('LiquidityInfo', LiquidityInfoSchema);
export default LiquidityInfo;
