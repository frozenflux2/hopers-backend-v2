export const groupObject = (object: Array<any>, key: string) =>
    object.reduce(
        (result, item) => ({
            ...result,
            [item[key]]: item,
        }),
        {},
    );
