import dotenv from 'dotenv';
import { NextFunction, Request, Response } from 'express';
import main from '../logic';
// import fetchLiquiditiesInfo from 'src/logic/liquidities_info';
// import { MAX_FETCH_ITEMS } from '../constants';
// import Collection from '../models/collection.model';
// import { MarketplaceInfo } from '../types';
// import { getDataFromDB, runQuery } from '../utils';

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
    // fetchLiquiditiesInfo()
    //     .then(() => {
    //         res.status(200).send({ success: true });
    //     })
    //     .catch((err) => {
    //         res.status(400).send({ success: false, error: err.message });
    //     });
    main();
    res.status(200).send({ message: 'started!' });
};
