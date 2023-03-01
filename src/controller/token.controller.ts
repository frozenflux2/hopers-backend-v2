import { NextFunction, Request, Response } from 'express';
import Token from '../models/token.model';
import { getDataFromDB, saveData } from '../utils/async';
import { validateRequired } from '../utils/validation';

export const addToken = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    const data = req.body;
    const requiredValidationResult = validateRequired(data, ['id', 'chain']);
    if (!requiredValidationResult.status) {
        return res.status(400).send({
            type: 'Validation Error',
            missingFields: requiredValidationResult.missingFields,
        });
    }
    const { id } = data;
    Token.findOne({ id }, (err, doc) => {
        if (err) return next(err);
        if (doc)
            return res.status(400).send({
                message: 'Token already exists',
            });
        const newToken = new Token(data);
        newToken.save((savedErr, saved) => {
            if (savedErr) return next(savedErr);
            return res.status(200).send(saved);
        });
    });
};

export const editToken = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    const { id } = req.params;
    if (!id) return res.status(400).send({ message: 'Invalid parameter' });
    const updatedData = req.body;
    if (!updatedData) return res.status(400).send({ message: 'Invalid data' });
    Token.findOne({ id }, (err, doc) => {
        if (err) return next(err);
        if (!doc)
            return res.status(400).send({
                message: "Liquidity doesn't exist! Please add it first.",
            });
        Object.keys(updatedData).forEach((key) => {
            const value = updatedData[key];
            doc[key] = value;
            console.log('debug', key, value, doc);
        });

        doc.save((updateErr, updated) => {
            if (updateErr) return next(updateErr);
            return res.status(200).send(updated);
        });
    });
};

export const removeToken = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    const { id } = req.params;
    if (!id) return res.status(400).send({ message: 'Invalid parameter' });
    Token.findOneAndRemove({ id }, (err, _doc) => {
        if (err) return next(err);
        return res.status(200).send({ message: 'Successfully Removed' });
    });
};

export const getAllTokens = async (
    _req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const data = await getDataFromDB(Token);
        res.status(200).send(data);
    } catch (e) {
        return next(e);
    }
};

export const backupTokens = async (
    req: Request,
    res: Response,
    _next: NextFunction,
) => {
    const data = req.body;
    if (!data || !data.length)
        return res.status(400).send({ message: 'Invalid Data' });
    const added = {},
        errorList = {};
    try {
        for (let token of data) {
            const { id } = token;
            try {
                const requiredValidationResult = validateRequired(token, [
                    'id',
                    'chain',
                ]);
                if (!requiredValidationResult.status) {
                    errorList[id] = {
                        type: 'Validation Error',
                        missingFields: requiredValidationResult.missingFields,
                    };
                    continue;
                }
                const existingData = await getDataFromDB(Token, { id });
                if (existingData.length) {
                    errorList[id] = 'Already Existing';
                } else {
                    try {
                        const newToken = new Token(token);
                        const saveResult = await saveData(newToken);
                        added[id] = saveResult;
                    } catch (saveError) {
                        errorList[id] = saveError.message;
                    }
                }
            } catch (e) {
                errorList[id] = e.message;
            }
        }
        res.status(200).send({ success: true, added, errorList });
    } catch (globalError) {
        res.status(400).send({ message: globalError.message });
    }
};
