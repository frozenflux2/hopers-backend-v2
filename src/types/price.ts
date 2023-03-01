import { TokenType } from './tokens';

export type FloorPriceType = Record<`${TokenType}FloorPrice`, number>;

export interface VolumePriceType extends Record<`${TokenType}Volume`, number> {
    totalVolumeInJuno: number;
}

export type TokenPriceType = {
    [key in TokenType]: any;
};
