import { MarketplaceInfo } from '../types';
import { convertStringToNumber } from './string_numbers';

export const getTokenIdNumber = (id: string): string => {
    if (!id) return '';
    return id.split('.').pop() || '';
};

export const getCustomTokenId = (origin: string, target: string): string =>
    `${target}.${origin.split('.').pop()}`;

export const buildNFTItem = (
    item: any,
    contractAddress: string,
    collection: MarketplaceInfo,
    metaData: any,
) => {
    const customTokenId = collection.customTokenId;

    const tokenNumber: number = convertStringToNumber(
        getTokenIdNumber(item.token_id),
    );
    const crrItem = {
        ...item,
        ...(customTokenId && {
            token_id_display: getCustomTokenId(item.token_id, customTokenId),
        }),
        contractAddress,
        collectionId: collection.collectionId,
        ...(metaData &&
            metaData[tokenNumber - 1] && {
                metaData: metaData[tokenNumber - 1],
            }),
    };
    return crrItem;
};
