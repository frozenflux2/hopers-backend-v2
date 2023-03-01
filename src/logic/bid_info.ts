import dotenv from 'dotenv';
import Collection from '../models/collection.model';
import { MAX_FETCH_ITEMS } from '../constants';
import { getDataFromDB, runQuery, saveCacheData } from '../utils';
import { MarketplaceInfo } from '../types';
import Bids from '../models/bids.model';

dotenv.config();

const MarketplaceContract = process.env.MARKETPLACE_CONTRACT;

export const fetchCollectionBidsInfo = async () => {
    const fetchCollectionBidsByAddress = async (address: string) => {
        let offers: any[] = [];
        const fetchCollectionBids = async (startAfter?: any) => {
            const fetchedBidsResult = await runQuery(MarketplaceContract, {
                collection_bid_by_collection: {
                    collection: address,
                    start_after: startAfter,
                    limit: MAX_FETCH_ITEMS,
                },
            });
            const fetchedBids = fetchedBidsResult?.bids || [];
            offers = offers.concat(fetchedBids);
            if (fetchedBids.length === MAX_FETCH_ITEMS) {
                await fetchCollectionBids(
                    fetchedBids[MAX_FETCH_ITEMS - 1].bidder,
                );
            }
        };
        await fetchCollectionBids();
        return offers;
    };
    const collections: any = await getDataFromDB(Collection);
    const queries = collections.map((collection: MarketplaceInfo) =>
        fetchCollectionBidsByAddress(collection.nftContract),
    );
    Promise.all(queries).then((queryResults) => {
        queryResults.forEach((result, index: number) => {
            saveCacheData(Bids, collections[index].collectionId, result);
        });
    });
};
