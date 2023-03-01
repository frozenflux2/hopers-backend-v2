import dotenv from 'dotenv';
import { MAX_FETCH_ITEMS } from '../constants';
import { CollectionStateType, TokenType } from '../types';
import { getDataFromDB, runQuery, saveCacheData } from '../utils';
import CollectionInfo from '../models/collectionInfo.model';
import Collection from '../models/collection.model';

dotenv.config();

const MarketplaceContract = process.env.MARKETPLACE_CONTRACT;
const MintContract = process.env.MINT_CONTRACT;

const getMin = (number: number, max?: number): number => {
    const maxNumber = max || 1e5;
    return maxNumber === number ? 0 : number;
};

const fetchCollectionInfo = async () => {
    const collections: any = await getDataFromDB(Collection);
    for (const collection of collections) {
        try {
            let storeObject: CollectionStateType = {
                mintCheck: [],
                mintedNfts: 0,
                totalNfts: collection?.mintInfo?.totalNfts || 0,
                maxNfts: 0,
                imageUrl: '',
                price: 0,
                myMintedNfts: null,
            };
            if (collection.mintContract) {
                if (!collection.mintInfo?.mintLogic?.fetchInfo) {
                    const queryResult = await runQuery(
                        collection.mintContract,
                        {
                            get_state_info: {},
                        },
                    );
                    if (queryResult)
                        storeObject = {
                            mintCheck: queryResult.check_mint,
                            mintedNfts: +(queryResult.count || '0'),
                            totalNfts: +(queryResult.total_nft || '0'),
                            maxNfts: +(
                                queryResult.max_nft ||
                                queryResult.total_nft ||
                                '0'
                            ),
                            imageUrl: queryResult.image_url,
                            price: +(queryResult.price || '0') / 1e6,
                            myMintedNfts: null,
                        };
                }
            } else if (collection.isLaunched) {
                try {
                    const queryResult = await runQuery(MintContract, {
                        get_collection_info: {
                            nft_address: collection.nftContract,
                        },
                    });
                    if (queryResult) {
                        storeObject = {
                            mintCheck: queryResult.check_mint,
                            mintedNfts: +(queryResult.mint_count || '0'),
                            totalNfts: +(queryResult.total_nft || '0'),
                            maxNfts: +(
                                queryResult.max_nft ||
                                queryResult.total_nft ||
                                '0'
                            ),
                            imageUrl: queryResult.image_url,
                            price: +(queryResult.price || '0') / 1e6,
                            myMintedNfts: null,
                        };
                    }
                } catch {
                    // console.error(collection.collectionId, e);
                }
            }

            if (collection.isLaunched) {
                const tradingInfoResult = await runQuery(MarketplaceContract, {
                    get_tvlby_collection: {
                        collection: collection.nftContract,
                        limit: MAX_FETCH_ITEMS,
                    },
                });
                let totalVolume: any = {};
                (
                    Object.keys(TokenType) as Array<keyof typeof TokenType>
                ).forEach((key) => (totalVolume[`${TokenType[key]}Total`] = 0));
                tradingInfoResult?.tvl?.forEach((item: any) => {
                    totalVolume[`${item.denom}Total`] =
                        (totalVolume[`${item.denom}Total`] || 0) +
                        item.amount / 1e6;
                });

                storeObject.tradingInfo = totalVolume;
            }

            if (
                collection.marketplaceContract &&
                collection.marketplaceContract.length
            ) {
                try {
                    const tradingInfoResult = await runQuery(
                        collection.marketplaceContract[0],
                        {
                            get_trading_info: {},
                        },
                    );
                    let crrTradingInfo: any = storeObject.tradingInfo;
                    (
                        Object.keys(TokenType) as Array<keyof typeof TokenType>
                    ).forEach((key) => {
                        const totalKey = `${TokenType[key]}Total`;
                        const minKey = `${TokenType[key]}Min`;
                        const maxKey = `${TokenType[key]}Max`;

                        crrTradingInfo[totalKey] =
                            (crrTradingInfo[totalKey] || 0) +
                            +(
                                tradingInfoResult[
                                    `total_${key.toLowerCase()}`
                                ] || '0'
                            ) /
                                1e6;

                        crrTradingInfo[minKey] = getMin(
                            +(
                                tradingInfoResult[`min_${key.toLowerCase()}`] ||
                                '0'
                            ) / 1e6,
                        );
                        crrTradingInfo[maxKey] =
                            +(
                                tradingInfoResult[`max_${key.toLowerCase()}`] ||
                                '0'
                            ) / 1e6;
                    });

                    storeObject.tradingInfo = crrTradingInfo;
                } catch (e) {}
            }

            let saleHistory: any[] = [];
            const fetchSaleHistory = async (startId?: any) => {
                const queryResult = await runQuery(MarketplaceContract, {
                    sale_history_by_collection: {
                        collection: collection.nftContract,
                        start_after: startId,
                        limit: MAX_FETCH_ITEMS,
                    },
                });
                const saleHistoryResult = queryResult?.sale_history || [];
                saleHistory = saleHistory.concat(
                    saleHistoryResult.map((item: any) => ({
                        ...item,
                        collectionId: collection.collectionId,
                    })),
                );
                if (saleHistoryResult?.length) {
                    if (saleHistoryResult.length === MAX_FETCH_ITEMS) {
                        await fetchSaleHistory({
                            token_id:
                                saleHistoryResult[MAX_FETCH_ITEMS - 1].token_id,
                            time: saleHistoryResult[MAX_FETCH_ITEMS - 1].time,
                        });
                    }
                }
            };
            await fetchSaleHistory();
            storeObject.saleHistory = saleHistory;
            saveCacheData(CollectionInfo, collection.collectionId, storeObject);
        } catch (e) {
            console.log('collection info error', collection.collectionId);
        }
    }
};

export default fetchCollectionInfo;
