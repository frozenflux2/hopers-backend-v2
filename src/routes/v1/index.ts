import express from 'express';

import * as collectionController from '../../controller/collection.controller';
import * as idoController from '../../controller/ido.controller';
import * as liquidityController from '../../controller/liquidity.controller';
import * as tokenController from '../../controller/token.controller';
import * as cacheController from '../../controller/cache.controller';
import * as debugController from '../../controller/debug.controller';

const router = express.Router();

//============================//
//           Default          //
//============================//
router.get('/', debugController.getMemoryUsage);
router.get('/memory-usage', debugController.getMemoryUsage);
router.get('/test', debugController.test);

//============================//
//         Collections        //
//============================//
router.post('/collection/add', collectionController.addCollection);
router.post(
    '/collection/edit/:collectionId',
    collectionController.editCollection,
);
router.delete(
    '/collection/:collectionId',
    collectionController.removeCollection,
);
router.get('/collection/all', collectionController.getAllCollections);
router.post('/collection/backup', collectionController.backupCollections);

//============================//
//            IDOs            //
//============================//
router.post('/ido/add', idoController.addIDO);
router.post('/ido/edit/:id', idoController.editIDO);
router.delete('/ido/:id', idoController.removeIDO);
router.get('/ido/all', idoController.getAllIDOs);

//============================//
//        Liquidities         //
//============================//
router.post('/liquidity/add', liquidityController.addLiquidity);
router.post(
    '/liquidity/edit/:tokenA/:tokenB',
    liquidityController.editLiquidity,
);
router.delete(
    '/liquidity/:tokenA/:tokenB',
    liquidityController.removeLiquidity,
);
router.get('/liquidity/all', liquidityController.getAllLiquidities);
router.post('/liquidity/backup', liquidityController.backupLiquidities);

//============================//
//           Tokens           //
//============================//
router.post('/token/add', tokenController.addToken);
router.post('/token/edit/:id', tokenController.editToken);
router.delete('/token/:id', tokenController.removeToken);
router.get('/token/all', tokenController.getAllTokens);
router.post('/token/backup', tokenController.backupTokens);

//============================//
//            Cache           //
//============================//
router.get('/cache', cacheController.getCacheValue);
router.get('/update-cache', cacheController.updateCache);
router.get('/backup', cacheController.backupDatabase);

export default router;
