import { SocialLinks } from './basic';
import { MintLogicItemInterface } from './mint_logic';
import { FloorPriceType, VolumePriceType } from './price';
import { TokenType } from './tokens';

export enum CollectionIds {
    HOPEGALAXYI = 'hopegalaxy1',
    MINTPASSI = 'mintpass1',
    MINTPASSII = 'mintpass2',
    JUNOPUNKS = 'junopunks',
    NETANOTS = 'netanots',
    SUNNYSIDE = 'sunnyside',
    JUNOFARMING = 'junofarming',
    BORED = 'bored',
    CRYPTOGIRLS = 'cryptogirls',
    GOBLIN = 'goblin',
    WITCHES = 'witches',
    ROMANS = 'romans',
    JUNOPUNKS2 = 'junopunks2',
    BORED3D = 'bored3d',
    GORILLA = 'gorilla',
    LUNATICS = 'lunatic',
    KOALA = 'koala',
    PUNKLAND = 'punkland',
}

export interface StatisticSettings extends FloorPriceType, VolumePriceType {
    total: string;
    owner: string;
    itemsOnSale: string;
}

export type StatisticOption = { [key in keyof StatisticSettings]?: boolean };

export interface MarketplaceBasicInfo {
    imageUrl: string;
    backgroundUrl: string;
    logoUrl?: string;
    title: string;
    creator: string;
    collectionId: CollectionIds;
    description: string;
    nftContract: string;
    mintContract: string;
    marketplaceContract: string[];
    socialLinks: SocialLinks;
    statisticOption?: StatisticOption; // invisible status for statistic items. if true, invisible
    customTokenId?: string; // if this value exists token_id will be replaced. e.g. Hoper.1916 -> MintPass I.1916 when this value is "MintPass I"
    metaDataUrl?: string;
    listMinPrice?: {
        amount: number;
        denom: TokenType;
    };
    isLaunched: boolean;
    disableMarketplace?: boolean; // define whether target collection has marketplace or not. if don't have marketplace, it only has mint page
}

export interface MarketplaceMintInfo {
    totalNfts: number;
    royalties: string;
    price: string;
    denom?: TokenType;
    mintImage: string;
    mintDate?: string;
    mintUrl?: string;
    mintLogic?: MintLogicItemInterface;
    isWhiteListMint?: boolean;
}

export interface MarketplaceInfo extends MarketplaceBasicInfo {
    mintInfo?: MarketplaceMintInfo;
}
