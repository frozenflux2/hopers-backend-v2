import dotenv from 'dotenv';
import { NextFunction, Request, Response } from 'express';
import { MAX_FETCH_ITEMS } from '../constants';
import Collection from '../models/collection.model';
import { MarketplaceInfo } from '../types';
import { getDataFromDB, runQuery } from '../utils';

dotenv.config();

const MarketplaceContract = process.env.MARKETPLACE_CONTRACT;

const formatMemoryUsage = (data) =>
    `${Math.round((data / 1024 / 1024) * 100) / 100} MB`;

export const getMemoryUsage = async (
    _req: Request,
    res: Response,
    _next: NextFunction,
) => {
    try {
        const memoryData = process.memoryUsage();

        const memoryUsage = {
            rss: `${formatMemoryUsage(
                memoryData.rss,
            )} -> Resident Set Size - total memory allocated for the process execution`,
            heapTotal: `${formatMemoryUsage(
                memoryData.heapTotal,
            )} -> total size of the allocated heap`,
            heapUsed: `${formatMemoryUsage(
                memoryData.heapUsed,
            )} -> actual memory used during the execution`,
            external: `${formatMemoryUsage(
                memoryData.external,
            )} -> V8 external memory`,
        };
        res.status(200).send({ ...memoryUsage });
    } catch (e) {
        res.status(400).send({ message: e.message });
    }
};

export const test = async (
    _req: Request,
    res: Response,
    _next: NextFunction,
) => {
    res.status(200).send({ success: true });
    // const collections: any = await getDataFromDB(Collection);
    // try {
    //     const fetchCollectionBidsByAddress = async (address: string) => {
    //         let offers: any[] = [];
    //         const fetchCollectionBids = async (startAfter?: any) => {
    //             const fetchedBidsResult = await runQuery(MarketplaceContract, {
    //                 collection_bid_by_collection: {
    //                     collection: address,
    //                     start_after: startAfter,
    //                     limit: MAX_FETCH_ITEMS,
    //                 },
    //             });
    //             const fetchedBids = fetchedBidsResult?.bids || [];
    //             offers = offers.concat(fetchedBids);
    //             if (fetchedBids.length === MAX_FETCH_ITEMS) {
    //                 await fetchCollectionBids(
    //                     fetchedBids[MAX_FETCH_ITEMS - 1].bidder,
    //                 );
    //             }
    //         };
    //         await fetchCollectionBids();
    //         return offers;
    //     };
    //     const queries = collections.map((collection: MarketplaceInfo) =>
    //         fetchCollectionBidsByAddress(collection.nftContract),
    //     );
    //     Promise.all(queries)
    //         .then((queryResults) => {
    //             res.status(200).send({ collections, queryResults });
    //         })
    //         .catch((err) => {
    //             res.status(400).send({ collections, message: err.message });
    //         });
    // } catch (e) {
    //     res.status(400).send({
    //         collections,
    //         message: e.message,
    //         where: 'fetching',
    //     });
    // }
};
