import dotenv from 'dotenv';
import TokenPriceInfo from '../models/tokenPriceInfo.model';
import Token from '../models/token.model';
import { TokenType } from '../types';
import { getQuery, getDataFromDB, saveCacheData } from '../utils';

dotenv.config();

const CoinGeckoAPIKey = process.env.COINGECKO_API_KEY;

// const initialState: TokenPriceType = (
//     Object.keys(TokenType) as Array<keyof typeof TokenType>
// ).reduce(
//     (result, key) => ({ ...result, [TokenType[key]]: null }),
//     {},
// ) as TokenPriceType;

const customPromiseAll = (queries: Promise<any>[]): Promise<any> => {
    return new Promise((resolve, reject) => {
        Promise.all(queries)
            .then((results) => resolve(results))
            .catch((err) => reject(err));
    });
};

export const fetchTokenPriceInfo = async () => {
    let keys: any = [];
    const fetchQueries: any[] = [];
    const tokens: any[] = await getDataFromDB(Token);
    const tokenCoingeckoIds = tokens.reduce(
        (result, token) => ({ ...result, [token.id]: token.coingeckoId || '' }),
        {},
    );
    Object.keys(tokenCoingeckoIds).forEach((key: string) => {
        const crrCoingeckoId = tokenCoingeckoIds[key as TokenType];
        if (crrCoingeckoId) {
            keys.push(key as TokenType);
            if (CoinGeckoAPIKey) {
                fetchQueries.push(
                    getQuery({
                        url: `https://pro-api.coingecko.com/api/v3/coins/${crrCoingeckoId}?x_cg_pro_api_key=${CoinGeckoAPIKey}`,
                    }),
                );
            } else {
                fetchQueries.push(
                    getQuery({
                        url: `https://api.coingecko.com/api/v3/coins/${crrCoingeckoId}`,
                    }),
                );
            }
        }
    });
    try {
        const queryResults = await customPromiseAll(fetchQueries);
        queryResults.forEach((result: any, index: number) => {
            saveCacheData(
                TokenPriceInfo,
                keys[index],
                result
                    ? {
                          market_data: result.market_data,
                      }
                    : null,
            );
        });
    } catch (err) {
        for (const key of Object.keys(TokenType) as Array<
            keyof typeof TokenType
        >) {
            saveCacheData(TokenPriceInfo, key, null);
        }
    }
};
