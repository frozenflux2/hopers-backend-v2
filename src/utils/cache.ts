import mongoose from 'mongoose';

export const saveCacheData = async (
    DB: mongoose.Model<any>,
    key: string,
    content: any,
) =>
    new Promise((_resolve, reject) => {
        if (!DB || !key || !content) return;
        DB.findOne({ key }, (err, doc) => {
            if (err) reject(err);
            if (doc) {
                doc.content = content;
                doc.save((savingErr, _savedData) => {
                    if (savingErr) reject(savingErr);
                });
            } else {
                const newData = new DB({ key, content });
                newData.save((savingErr, _savedData) => {
                    if (savingErr) reject(savingErr);
                });
            }
        });
    });

export const getCacheData = async (
    DB: mongoose.Model<any>,
    option?: { query?: any; isArray?: boolean },
) =>
    new Promise((resolve, reject) => {
        if (!DB) resolve({});
        const { query, isArray } = option;
        DB.find(query || {}, (err, docs) => {
            if (err) reject(err);
            resolve(
                isArray
                    ? docs
                    : docs.reduce(
                          (result, doc) => ({
                              ...result,
                              [doc.key]: doc.content || {},
                          }),
                          {},
                      ),
            );
        });
    });
