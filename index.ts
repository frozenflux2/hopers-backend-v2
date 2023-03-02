import mongoose from 'mongoose';
import dotenv from 'dotenv';
import main from './src/logic';
import app from './src/app';
import { fetchCollectionBidsInfo } from './src/logic/bid_info';
import fetchCollectionInfo from './src/logic/collection_info';
import { fetchIDOSaleInfo, fetchIDOStateInfo } from './src/logic/ido_info';
import fetchLiquiditiesInfo from './src/logic/liquidities_info';
import fetchMarketplaceNFTs from './src/logic/marketplace_nfts';
import { fetchTokenPriceInfo } from './src/logic/token_price_info';
import { FETCH_INTERVAL } from './src/constants';
// const port = config.port;
dotenv.config();

const port = process.env.PORT || 5000;
// const mongooseURI = process.env.MONGOOSE_URI;
const mongooseURI = process.env.MONGODB_URI;

setInterval(fetchCollectionBidsInfo, FETCH_INTERVAL);
setInterval(fetchCollectionInfo, FETCH_INTERVAL);
setInterval(fetchIDOSaleInfo, FETCH_INTERVAL);
setInterval(fetchIDOStateInfo, FETCH_INTERVAL);
setInterval(fetchLiquiditiesInfo, FETCH_INTERVAL);
setInterval(fetchMarketplaceNFTs, FETCH_INTERVAL);
setInterval(fetchTokenPriceInfo, FETCH_INTERVAL);

mongoose
    .connect(mongooseURI)
    .then(() => {
        console.log('Connected to MongoDB');
        // main();
        app.listen(port, () => {
            console.log(`Listening to port ${port}`);
            // main();
        });
    })
    .catch((err) => {
        console.log('err: ', err);
    });
