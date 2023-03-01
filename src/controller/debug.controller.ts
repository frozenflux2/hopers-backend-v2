import { NextFunction, Request, Response } from 'express';

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
