import { NextFunction, Request, Response } from "express";
import IDO from "../models/ido.model";
import { getDataFromDB } from "../utils/async";
import { validateRequired } from "../utils/validation";

export const addIDO = async(req: Request, res: Response, next: NextFunction) => {
    const data = req.body;
    const requiredValidationResult = validateRequired(data, ['id', 'image', 'symbol', 'description', 'contract'])
    if (!requiredValidationResult.status) {
        return res.status(400).send({
            type: "Validation Error",
            missingFields: requiredValidationResult.missingFields
        })
    }
    const { id } = data
    IDO.findOne({ id }, (err, doc) => {
        if (err) return next(err)
        if (doc) return res.status(400).send({
            message: "IDO already exists"
        })
        const newIDO = new IDO(data)
        newIDO.save((savedErr, saved) => {
            if (savedErr) return next(savedErr)
            return res.status(200).send(saved)
        })
    })
}

export const editIDO = async(req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    if (!id) return res.status(400).send({ message: "Invalid parameter" })
    const updatedData = req.body;
    if (!updatedData) return res.status(400).send({ message: "Invalid data" })
    IDO.findOne({ id }, (err, doc) => {
        if (err) return next(err)
        if (!doc) return res.status(400).send({ message: "IDO doesn't exist! Please add it first." })
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

export const removeIDO = async(req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    if (!id) return res.status(400).send({ message: "Invalid parameter" })
    IDO.findOneAndRemove({ id }, (err: any, _doc) => {
        if (err) return next(err)
        return res.status(200).send({ message: 'Successfully Removed' })
    })
}


export const getAllIDOs = async(_req: Request, res: Response, next: NextFunction) => {
    try {
        const data = await getDataFromDB(IDO)
        res.status(200).send(data)
    } catch (e) {
        return next(e)
    }
}