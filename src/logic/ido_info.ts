import { runQuery, saveCacheData } from '../utils';
import { getDataFromDB } from '../utils/async';
import IDO from '../models/ido.model';
import IdoInfo from '../models/idoInfo.model';

export const fetchIDOStateInfo = async () => {
    const idos: any = await getDataFromDB(IDO);
    const queries = idos.map((ido: any) =>
        runQuery(ido.contract, {
            get_state_info: {},
        }),
    );
    let idoStateInfo: any[] = [];
    Promise.all(queries).then((queryResults) => {
        idoStateInfo = queryResults.map((item, index: number) => ({
            ...item,
            contractAddress: idos[index].contract,
        }));
        saveCacheData(IdoInfo, 'idoStateInfo', idoStateInfo);
    });
};

export const fetchIDOSaleInfo = async () => {
    const idos: any = await getDataFromDB(IDO);
    const queries = idos.map((ido: any) =>
        runQuery(ido.contract, {
            get_sale_info: {},
        }),
    );
    let idoSaleInfo: any[] = [];
    Promise.all(queries).then((queryResults) => {
        idoSaleInfo = queryResults.map((item, index: number) => ({
            ...item,
            contractAddress: idos[index].contract,
        }));
        saveCacheData(IdoInfo, 'idoSaleInfo', idoSaleInfo);
    });
};
