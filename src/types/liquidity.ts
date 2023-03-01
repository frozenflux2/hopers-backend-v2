import { TokenType } from './tokens';

export type TPoolConfig = {
    lockDuration: number;
    distributionEnd?: number;
    rewardToken?: TokenType;
};
export type TPool = {
    id: number;
    token1: TokenType;
    token2: TokenType;
    token1Reserve: number;
    token2Reserve: number;
    isVerified: boolean;
    apr: string | string[];
    contract: string;
    lpAddress: string;
    stakingAddress?: string | string[];
    pool: number;
    ratio: number;
    volume?: number;
    earned?: number;
    balance?: number;
    config?: TPoolConfig | TPoolConfig[];
};

export type TLiquidity = {
    tokenA: TokenType;
    tokenB: TokenType;
    contractAddress: string;
    stakingAddress?: string | string[];
    isVerified: boolean;
};
