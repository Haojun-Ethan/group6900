

/*  8-01
https://axios.rest/pages/advanced/interceptors 
https://juejin.cn/post/7555795679383273481


*/

export function snakeToCamel(str) {
    return str.replace(/([-_][a-z0-9])/gi, (group) =>
    group.toUpperCase().replace('-', '').replace('_', ''));
}

export function camelToSnake(str) {
    if (typeof str !== 'string') return str;
    return str.replace(/([A-Z])/g, ($1) => `_${$1.toLowerCase()}`);
}

function isPlainObject(obj){
    return (
        obj !==null &&
        typeof obj === 'object' &&
        Object.prototype.toString.call(obj) === '[object Object]'
    )
}

export function adaptToCamel(data) {
    if (!data) return data;

    if (Array.isArray(data)){
        return data.map((item) => adaptToCamel(item));
    }

    if(isPlainObject(data)) {
        const result = {};
        for (const [key, value] of Object.entries(data)){
            result[snakeToCamel(key)] = adaptToCamel(value);
        }
        return result;
    }

    return data;
}

export function adaptToSnake(data) {
    if (!data) return data;

    if (Array.isArray(data)) {
        return data.map((item) => adaptToSnake(item));
    }

    if (isPlainObject(data)) {
        const result = {};
        for (const [key, value] of Object.entries(data)) {
        result[camelToSnake(key)] = adaptToSnake(value);
        }
        return result;
    }

    return data;
}