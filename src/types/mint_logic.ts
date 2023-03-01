import { MarketplaceInfo } from './collection';
import { TokenType } from './tokens';

export type CollectionStateType = {
    mintCheck: boolean[];
    mintedNfts: number;
    totalNfts: number;
    maxNfts: number;
    imageUrl: string;
    myMintedNfts: number | null;
    price: number;
    tokenPrice?: number;
    tokenAddress?: string;
    tradingInfo?: Record<
        `${TokenType}Max` | `${TokenType}Min` | `${TokenType}Total`,
        number
    >;
    saleHistory?: any[];
    mintInfo?: {
        startMintTime: number;
        mintPeriod: number;
    };
};

export interface LogicParamsInterface {
    collection: MarketplaceInfo;
    runQuery: (
        contractAddress: string,
        queryMsg: Record<string, any>,
    ) => Promise<any>;
    account?: string;
}

export interface GetMintMessageInterface extends LogicParamsInterface {
    account: string;
    state: any;
    runExecute: (
        contractAddress: string,
        executeMsg: Record<string, any>,
        option?: { memo?: string; funds?: string; denom?: string },
    ) => Promise<any>;
}

export type ExtraLogicInterface = GetMintMessageInterface;

export interface MintLogicItemInterface {
    fetchInfo?: (params: LogicParamsInterface) => Promise<CollectionStateType>;
}
