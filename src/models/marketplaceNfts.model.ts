import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const MarketplaceNftsSchema = new Schema(
    {
        key: {
            type: String,
            required: true,
        },
        content: Object,
    },
    { timestamps: true },
);

const MarketplaceNfts = mongoose.model(
    'MarketplaceNfts',
    MarketplaceNftsSchema,
);
export default MarketplaceNfts;
