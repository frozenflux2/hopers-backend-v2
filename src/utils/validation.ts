export const validateRequired = (data: any, fields: string[]) => {
    if (!data || !fields || !fields.length) return { status: false, message: "empty data", missingFields: [] };
    const result = fields.reduce((result, item) => {
        if (!data[item]) {
            result = result.concat(item)
        }
        return result;
    }, [])
    if (result.length) {
        return { status: false, message: "some fields are missing", missingFields: result }
    }
    return { status: true }
}