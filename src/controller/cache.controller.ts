import { NextFunction, Request, Response } from 'express';
import { getCacheData } from '../utils';
import Bids from '../models/bids.model';
import CollectionInfo from '../models/collectionInfo.model';
import CollectionTraits from '../models/collectionTraits.model';
import IdoInfo from '../models/idoInfo.model';
import LiquidityInfo from '../models/liquidityInfo.model';
import MarketplaceNfts from '../models/marketplaceNfts.model';
import TokenPriceInfo from '../models/tokenPriceInfo.model';

const DBs = {
    collectionBidsInfo: { model: Bids, total: true, isArray: false },
    collectionInfo: { model: CollectionInfo, total: true, isArray: false },
    idoStateInfo: { model: IdoInfo, total: false, isArray: false },
    idoSaleInfo: { model: IdoInfo, total: false, isArray: false },
    liquiditiesInfo: { model: LiquidityInfo, total: true, isArray: true },
    collectionTraits: { model: CollectionTraits, total: true, isArray: false },
    marketplaceNFTs: { model: MarketplaceNfts, total: true, isArray: false },
    tokenPriceInfo: { model: TokenPriceInfo, total: true, isArray: false },
};

const getCacheValueByFields = (fields: Array<keyof typeof DBs>) => {
    if (!fields?.length) return {};
    const queries = fields.map((field) => {
        const db = DBs[field];
        return getCacheData(db.model, {
            query: db.total ? {} : { key: field },
            isArray: db.isArray || false,
        });
    });
    return new Promise((resolve, reject) => {
        Promise.all(queries)
            .then((results: any[]) => {
                resolve(
                    results.reduce(
                        (resultObject, resultItem, resultIndex) => ({
                            ...resultObject,
                            [fields[resultIndex]]: resultItem,
                        }),
                        {},
                    ),
                );
            })
            .catch((err) => reject(err));
    });
};

export const getCacheValue = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    const query = req.query?.fields || '';
    const fields = query ? String(query).split(',') : Object.keys(DBs);
    try {
        const result = await getCacheValueByFields(
            fields as Array<keyof typeof DBs>,
        );
        res.status(200).send(result);
    } catch (err) {
        next(err);
    }
};
