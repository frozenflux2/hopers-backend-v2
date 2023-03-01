import { NextFunction, Request, Response } from "express";
import Liquidity from "../models/liquidity.model";
import { getDataFromDB, saveData } from "../utils/async";
import { validateRequired } from "../utils/validation";

export const addLiquidity = async(req: Request, res: Response, next: NextFunction) => {
    const data = req.body;
    const requiredValidationResult = validateRequired(data, ['tokenA', 'tokenB', 'contractAddress', 'stakingAddress'])
    if (!requiredValidationResult.status) {
        return res.status(400).send({
            type: "Validation Error",
            missingFields: requiredValidationResult.missingFields
        })
    }
    const { tokenA, tokenB } = data
    Liquidity.findOne({ tokenA, tokenB }, (err, doc) => {
        if (err) return next(err)
        if (doc) return res.status(400).send({
            message: "Liquidity already exists"
        })
        const newLiquidity = new Liquidity(data)
        newLiquidity.save((savedErr, saved) => {
            if (savedErr) return next(savedErr)
            return res.status(200).send(saved)
        })
    })
}

export const editLiquidity = async(req: Request, res: Response, next: NextFunction) => {
    const { tokenA, tokenB } = req.params;
    if (!tokenA || !tokenB) return res.status(400).send({ message: "Invalid parameter" })
    const updatedData = req.body;
    if (!updatedData) return res.status(400).send({ message: "Invalid data" })
    Liquidity.findOne({ tokenA, tokenB }, (err, doc) => {
        if (err) return next(err)
        if (!doc) return res.status(400).send({ message: "Liquidity doesn't exist! Please add it first." })
        Object.keys(updatedData).forEach((key) => {
            const value = updatedData[key]
            doc[key] = value
        })

        doc.save((updateErr, updated) => {
            if (updateErr) return next(updateErr)
            return res.status(200).send(updated)
        })
    })
}

export const removeLiquidity = async(req: Request, res: Response, next: NextFunction) => {
    const { tokenA, tokenB } = req.params;
    if (!tokenA || !tokenB) return res.status(400).send({ message: "Invalid parameter" })
    Liquidity.findOneAndRemove({ tokenA, tokenB }, (err, _doc) => {
        if (err) return next(err)
        return res.status(200).send({ message: 'Successfully Removed' })
    })
}


export const getAllLiquidities = async(_req: Request, res: Response, next: NextFunction) => {
    try {
        const data = await getDataFromDB(Liquidity)
        res.status(200).send(data)
    } catch (e) {
        return next(e)
    }
}

export const backupLiquidities = async(req: Request, res: Response, _next: NextFunction) => {
    const data = req.body;
    if (!data || !data.length) return res.status(400).send({ message: "Invalid Data" })
    const
        added = {},
        errorList = {};
    try {
        for (let liquidity of data) {
            const { tokenA, tokenB } = liquidity;
            const key = `${tokenA}-${tokenB}`
            try {
                const requiredValidationResult = validateRequired(liquidity, ['tokenA', 'tokenB', 'contractAddress'])
                if (!requiredValidationResult.status) {
                    errorList[key] = {
                        type: "Validation Error",
                        missingFields: requiredValidationResult.missingFields
                    }
                    continue;
                }
                const existingData = await getDataFromDB(Liquidity, { tokenA, tokenB })
                if (existingData.length) {
                    errorList[key] = "Already Existing"
                } else {
                    try {
                        const newLiquidity = new Liquidity(liquidity);
                        const saveResult = await saveData(newLiquidity);
                        added[key] = saveResult;
                    } catch (saveError) {
                        errorList[key] = saveError.message;
                    }
                }
            } catch (e) {
                errorList[key] = e.message;
            }
        }
        res.status(200).send({ success: true, added, errorList })
    } catch (globalError) {
        res.status(400).send({ message: globalError.message })
    }
}