import axios from 'axios';
import { headersType, methodType, urlType } from '../types';

const fetch = ({
    method,
    url,
    headers,
    data,
}: {
    method: methodType;
    url: urlType;
    headers?: any;
    data?: any;
}) => {
    return axios({
        method,
        url,
        headers,
        data,
    });
};

export const getQuery = async ({
    url,
    method,
    headers,
}: {
    url: urlType;
    method?: methodType;
    headers?: headersType;
}) => {
    try {
        const result = await fetch({
            url,
            method: method || 'get',
            headers: { 'content-type': 'application/json', ...(headers || {}) },
        });
        return result.data;
    } catch {
        // console.error('axios error at', url, method);
        return null;
    }
};
