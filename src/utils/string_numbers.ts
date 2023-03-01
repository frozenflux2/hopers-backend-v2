export const convertNumberToString = (
    number: number,
    decimal: number = 2,
): string => {
    return number.toLocaleString(undefined, {
        maximumFractionDigits: decimal,
    });
};

export const convertStringToNumber = (string: string): number => {
    const result = Number(string);
    return isNaN(result) ? 0 : result;
};

export const addSuffix = (number: number, decimal: number = 2): string => {
    if (number >= 1e5) return `${convertNumberToString(number / 1e6)}M`;
    if (number >= 1e2) return `${convertNumberToString(number / 1e3)}K`;
    return convertNumberToString(number, decimal);
};
