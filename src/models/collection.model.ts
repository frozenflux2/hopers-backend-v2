import mongoose from "mongoose";
const Schema = mongoose.Schema;

const CollectionSchema = new Schema({
    imageUrl: {
        type: String,
        default: "",
    },
    backgroundUrl: {
        type: String,
        default: "",
    },
    logoUrl: String,
    title: {
        type: String,
        required: true
    },
    creator: {
        type: String,
        default: ""
    },
    collectionId: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    nftContract: {
        type: String,
        required: true
    },
    mintContract: {
        type: String,
        default: ""
    },
    marketplaceContract: {
        type: [String],
        requried: true,
    },
    socialLinks: {
        discord: {
            type: String,
            default: ""
        },
        website: {
            type: String,
            default: ""
        },
        twitter: {
            type: String,
            default: ""
        }
    },
    statisticOption: Object,
    customTokenId: String,
    metaDataUrl: String,
    listMinPrice: {
        amount: Number,
        denom: String,
    },
    isLaunched: {
        type: Boolean,
        required: true,
    },
    disableMarketplace: Boolean,
    mintInfo: {
        totalNfts: Number,
        royalties: String,
        price: String,
        denom: String,
        mintImage: String,
        mintDate: String,
        mintUrl: String,
        mintLogic: String,
        isWhiteListMint: Boolean,
    }
}, { timestamps: true });

const Collection = mongoose.model("Collection", CollectionSchema);
export default Collection;