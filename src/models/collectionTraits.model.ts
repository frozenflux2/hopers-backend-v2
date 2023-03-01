import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const CollectionTraitsSchema = new Schema(
    {
        key: {
            type: String,
            required: true,
        },
        content: Object,
    },
    { timestamps: true },
);

const CollectionTraits = mongoose.model(
    'CollectionTraits',
    CollectionTraitsSchema,
);
export default CollectionTraits;
