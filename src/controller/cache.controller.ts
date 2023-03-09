import { NextFunction, Request, Response } from 'express';
import { getCacheData, getDataFromDB, makePromiseFunction } from '../utils';
import Bids from '../models/bids.model';
import CollectionInfo from '../models/collectionInfo.model';
import CollectionTraits from '../models/collectionTraits.model';
import IdoInfo from '../models/idoInfo.model';
import LiquidityInfo from '../models/liquidityInfo.model';
import MarketplaceNfts from '../models/marketplaceNfts.model';
import TokenPriceInfo from '../models/tokenPriceInfo.model';
import {
    fetchCollectionBidsInfo,
    fetchCollectionInfo,
    fetchIDOSaleInfo,
    fetchIDOStateInfo,
    fetchLiquiditiesInfo,
    fetchMarketplaceNFTs,
    fetchTokenPriceInfo,
} from '../logic';
import { BackupDBs } from '../constants';

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

export const updateCache = async (
    _req: Request,
    res: Response,
    _next: NextFunction,
) => {
    Promise.all([
        makePromiseFunction(fetchCollectionBidsInfo),
        makePromiseFunction(fetchCollectionInfo),
        makePromiseFunction(fetchIDOSaleInfo),
        makePromiseFunction(fetchIDOStateInfo),
        makePromiseFunction(fetchLiquiditiesInfo),
        makePromiseFunction(fetchMarketplaceNFTs),
        makePromiseFunction(fetchTokenPriceInfo),
    ])
        .then(() => {
            res.status(200).send({ success: true });
        })
        .catch((e) =>
            res.status(400).send({ success: false, message: e.message }),
        );
};

export const backupDatabase = async (
    _req: Request,
    res: Response,
    _next: NextFunction,
) => {
    let dbKeys = [];
    const getDataQueries = Object.keys(BackupDBs).map((key) => {
        dbKeys.push(key);
        return getDataFromDB(BackupDBs[key]);
    });
    Promise.all(getDataQueries)
        .then((results) => {
            const backupData = results.reduce(
                (data, result, index) => ({
                    ...data,
                    [dbKeys[index]]: result,
                }),
                {},
            );
            const data = JSON.stringify(backupData);

            const now = new Date();
            // const dateString = `${now.getFullYear()}-${now.getMonth()}-${now.getDate()} ${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`;
            res.setHeader(
                'Content-disposition',
                `attachment; filename=HopersDatabaseBackup ${now.toString()}.json`,
            );
            res.setHeader('Content-type', 'application/json');
            res.write(data, function (err) {
                console.log('err', err);
                res.end();
            });
        })
        .catch((err) => {
            console.log('promise err', err);
            res.status(400).send({ success: false, message: err.message });
        });
};
