import dotenv from 'dotenv';
import {
    buildNFTItem,
    getDataFromDB,
    getQuery,
    runQuery,
    saveCacheData,
} from '../utils';
import { AttributeType, MetaDataItemType } from '../types';
import { MAX_FETCH_ITEMS } from '../constants';
import Collection from '../models/collection.model';
import CollectionTraits from '../models/collectionTraits.model';
import MarketplaceNfts from '../models/marketplaceNfts.model';

dotenv.config();

const MarketplaceContract = process.env.MARKETPLACE_CONTRACT;

const getTraitsStatus = (
    metaData: MetaDataItemType[],
): { total: number; [key: string]: number } => {
    let result: { total: number; [key: string]: number } = { total: 0 };
    metaData.forEach((metaDataItem: MetaDataItemType) => {
        result.total += 1;
        const attributes: AttributeType[] = metaDataItem.attributes;
        attributes.forEach((attribute: AttributeType) => {
            result[attribute.value] = (result[attribute.value] || 0) + 1;
        });
    });
    return result;
};

const fetchMarketplaceNFTs = async () => {
    const collections: any = await getDataFromDB(Collection);
    for (const collection of collections) {
        let queries: any[] = [];
        let contractAddresses: string[] = [];
        if (
            collection.isLaunched &&
            collection.marketplaceContract &&
            collection.marketplaceContract.length
        ) {
            collection.marketplaceContract.forEach((contract: string) => {
                if (contract) {
                    queries.push(
                        runQuery(contract, {
                            get_offerings: {},
                        }),
                    );
                    contractAddresses.push(contract);
                }
            });
        }
        let metaData: MetaDataItemType[] | null = collection.metaDataUrl
            ? await getQuery({ url: collection.metaDataUrl })
            : null;
        if (metaData) {
            metaData = metaData?.sort((item1: any, item2: any) => {
                if (item1.edition) {
                    return item1.edition > item2.edition ? 1 : -1;
                } else {
                    return Number(item1.image.split('.')[0]) >
                        Number(item2.image.split('.')[0])
                        ? 1
                        : -1;
                }
            });
            saveCacheData(
                CollectionTraits,
                collection.collectionId,
                getTraitsStatus(metaData),
            );
        }

        let fetchedMarketplaceNFTs: any[] = [];

        const fetchMarketplaceNfts = async (startAfter?: any) => {
            const fetchedResult = await runQuery(MarketplaceContract, {
                asks: {
                    collection: collection.nftContract,
                    start_after: startAfter,
                    limit: MAX_FETCH_ITEMS,
                },
            });
            const fetchedNfts = fetchedResult?.asks || [];
            fetchedNfts.forEach((item: any) => {
                const crrItem = buildNFTItem(
                    item,
                    MarketplaceContract,
                    collection,
                    metaData,
                );
                fetchedMarketplaceNFTs = [...fetchedMarketplaceNFTs, crrItem];
            });
            if (fetchedNfts.length === MAX_FETCH_ITEMS) {
                await fetchMarketplaceNfts(
                    fetchedNfts[MAX_FETCH_ITEMS - 1].token_id,
                );
            }
        };
        await fetchMarketplaceNfts();

        await Promise.all(queries).then((queryResults: any) => {
            queryResults.forEach((queryResult: any, index: number) => {
                const fetchedResult =
                    queryResult?.offerings ||
                    (!!queryResult?.length && queryResult) ||
                    [];
                fetchedResult?.forEach((item: any) => {
                    const crrItem = buildNFTItem(
                        item,
                        contractAddresses[index],
                        collection,
                        metaData,
                    );
                    fetchedMarketplaceNFTs = [
                        ...fetchedMarketplaceNFTs,
                        crrItem,
                    ];
                });
            });
        });
        saveCacheData(
            MarketplaceNfts,
            collection.collectionId,
            fetchedMarketplaceNFTs,
        );
    }
};

export default fetchMarketplaceNFTs;
