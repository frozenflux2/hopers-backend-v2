export enum IDOIds {
    HOPERS = 'hopers',
    HOPERS2 = 'hopers2',
}

export interface IDOInterface {
    id: IDOIds;
    name: string;
    image: string;
    symbol: string;
    description: string;
    contract: string;
}
