import { FETCH_INTERVAL } from '../constants';
import { fetchCollectionBidsInfo } from './bid_info';
import fetchCollectionInfo from './collection_info';
import { fetchIDOSaleInfo, fetchIDOStateInfo } from './ido_info';
import fetchLiquiditiesInfo from './liquidities_info';
import fetchMarketplaceNFTs from './marketplace_nfts';
import { fetchTokenPriceInfo } from './token_price_info';

const chainCallingFunc = (
    func: () => Promise<any>,
    callbackFunc?: (data: any) => {},
    interval?: number,
) => {
    func().then((data) => {
        if (callbackFunc) callbackFunc(data);
        if (interval)
            setTimeout(() => {
                chainCallingFunc(func, callbackFunc, interval);
            }, interval);
    });
};

const main = () => {
    console.log('---------- start new fetching ----------');
    try {
        // chainCallingFunc(fetchCollectionBidsInfo, null, FETCH_INTERVAL);
        // chainCallingFunc(fetchCollectionInfo, null, FETCH_INTERVAL);
        // chainCallingFunc(fetchIDOSaleInfo, null, FETCH_INTERVAL);
        // chainCallingFunc(fetchIDOStateInfo, null, FETCH_INTERVAL);
        // chainCallingFunc(fetchLiquiditiesInfo, null, FETCH_INTERVAL);
        // chainCallingFunc(fetchMarketplaceNFTs, null, FETCH_INTERVAL);
        // chainCallingFunc(fetchTokenPriceInfo, null, FETCH_INTERVAL);
        setInterval(fetchCollectionBidsInfo, FETCH_INTERVAL);
        setInterval(fetchCollectionInfo, FETCH_INTERVAL);
        setInterval(fetchIDOSaleInfo, FETCH_INTERVAL);
        setInterval(fetchIDOStateInfo, FETCH_INTERVAL);
        setInterval(fetchLiquiditiesInfo, FETCH_INTERVAL);
        setInterval(fetchMarketplaceNFTs, FETCH_INTERVAL);
        setInterval(fetchTokenPriceInfo, FETCH_INTERVAL);
        console.log('here');
    } catch (e) {
        console.log('main logic err', e.message);
    }
};

export default main;
