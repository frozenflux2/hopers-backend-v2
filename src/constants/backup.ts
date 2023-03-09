import Bids from '../models/bids.model';
import Collection from '../models/collection.model';
import CollectionInfo from '../models/collectionInfo.model';
import IDO from '../models/ido.model';
import IdoInfo from '../models/idoInfo.model';
import Liquidity from '../models/liquidity.model';
import MarketplaceNfts from '../models/marketplaceNfts.model';
import Token from '../models/token.model';
import TokenPriceInfo from '../models/tokenPriceInfo.model';
import CollectionTraits from '../models/collectionTraits.model';
import LiquidityInfo from '../models/liquidityInfo.model';

export const BackupDBs = {
    bids: Bids,
    collection: Collection,
    collectionInfo: CollectionInfo,
    collectionTraits: CollectionTraits,
    ido: IDO,
    idoInfo: IdoInfo,
    liquidity: Liquidity,
    liquidityInfo: LiquidityInfo,
    marketplaceNfts: MarketplaceNfts,
    token: Token,
    tokenPriceInfo: TokenPriceInfo,
};
