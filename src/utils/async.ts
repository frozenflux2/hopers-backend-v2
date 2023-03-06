import mongoose from 'mongoose';

export const makePromiseFunction = (func: () => Promise<any>) =>
    new Promise((resolve, reject) => {
        func()
            .then((result) => resolve(result))
            .catch((err) => reject(err));
    });

export const getDataFromDB = (
    DB: mongoose.Model<any>,
    query?: any,
): Promise<mongoose.Document[]> =>
    new Promise((resolve, reject) => {
        DB.find(query || {}, (err: any, docs: mongoose.Document[]) => {
            if (err) reject(err);
            resolve(docs);
        });
    });

export const saveData = (doc: mongoose.Document): Promise<mongoose.Document> =>
    new Promise((resolve, reject) => {
        doc.save((updateErr, updated) => {
            if (updateErr) reject(updateErr);
            return resolve(updated);
        });
    });
