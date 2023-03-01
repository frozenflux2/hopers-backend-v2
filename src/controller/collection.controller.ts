import { NextFunction, Request, Response } from "express";
import Collection from "../models/collection.model";
import { getDataFromDB, saveData, validateRequired } from "../utils";

export const addCollection = async(req: Request, res: Response, next: NextFunction) => {
    const data = req.body;
    const requiredValidationResult = validateRequired(data, ['title', 'collectionId', 'description', 'nftContract', 'marketplaceContract', 'socialLinks'])
    if (!requiredValidationResult.status) {
        return res.status(400).send({
            type: "Validation Error",
            missingFields: requiredValidationResult.missingFields
        })
    }
    const { collectionId } = data
    Collection.findOne({ collectionId }, (err, doc) => {
        if (err) return next(err)
        if (doc) return res.status(400).send({
            message: "Collection already exists"
        })
        const newCollection = new Collection(data)
        newCollection.save((savedErr, saved) => {
            if (savedErr) return next(savedErr)
            return res.status(200).send(saved)
        })
    })
}

export const editCollection = async(req: Request, res: Response, next: NextFunction) => {
    const { collectionId } = req.params;
    if (!collectionId) return res.status(400).send({ message: "Invalid parameter" })
    const addedData = req.body;
    if (!addedData) return res.status(400).send({ message: "Invalid data" })
    Collection.findOne({ collectionId }, (err, doc) => {
        if (err) return next(err)
        if (!doc) return res.status(400).send({ message: "Collection doesn't exist! Please add it first." })
        Object.keys(addedData).forEach((key) => {
            const value = addedData[key]
            doc[key] = value
        })

        doc.save((updateErr, updated) => {
            if (updateErr) return next(updateErr)
            return res.status(200).send(updated)
        })
    })
}

export const removeCollection = async(req: Request, res: Response, next: NextFunction) => {
    const { collectionId } = req.params;
    if (!collectionId) return res.status(400).send({ message: "Invalid parameter" })
    Collection.findOneAndRemove({ collectionId }, (err, _doc) => {
        if (err) return next(err)
        return res.status(200).send({ message: 'Successfully Removed' })
    })
}

export const getAllCollections = async(_req: Request, res: Response, next: NextFunction) => {
    try {
        const data = await getDataFromDB(Collection)
        res.status(200).send(data)
    } catch (e) {
        return next(e)
    }
}

export const backupCollections = async(req: Request, res: Response, _next: NextFunction) => {
    const data = req.body;
    if (!data || !data.length) return res.status(400).send({ message: "Invalid Data" })
    const
        added = {},
        errorList = {};
    try {
        for (let collection of data) {
            const { collectionId } = collection;
            try {
                const requiredValidationResult = validateRequired(collection, ['title', 'collectionId', 'description', 'nftContract', 'marketplaceContract', 'socialLinks'])
                if (!requiredValidationResult.status) {
                    errorList[collectionId] = {
                        type: "Validation Error",
                        missingFields: requiredValidationResult.missingFields
                    }
                    continue;
                }
                const existingData = await getDataFromDB(Collection, { collectionId })
                if (existingData.length) {
                    errorList[collectionId] = "Already Existing"
                } else {
                    try {
                        const newCollection = new Collection(collection);
                        const saveResult = await saveData(newCollection);
                        added[collectionId] = saveResult;
                    } catch (saveError) {
                        errorList[collectionId] = saveError.message;
                    }
                }
            } catch (e) {
                errorList[collectionId] = e.message;
            }
        }
        res.status(200).send({ success: true, added, errorList })
    } catch (globalError) {
        res.status(400).send({ message: globalError.message })
    }
}