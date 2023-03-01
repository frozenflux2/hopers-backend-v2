export type AttributeType = {
    trait_type: string;
    value: string;
};

export type MetaDataItemType = {
    attributes: AttributeType[];
    [key: string]: any;
};
