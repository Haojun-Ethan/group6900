/* Rewrite ---- 4-01 */

import axios from "axios";

import { getAccess, getRefresh, setAccess, clearAll} from '../utils/storage';
import { ENDPOINTS, REQ , API_VERSION } from "../config/apiContract";

const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    timeout:10000,
    header:{'Content-Type':'application/json'}
})

apiClient.interceptors.request.use((config) => { 
    const access = getAccess();
    if(access) config.headers.Authorization = `Bearer ${access}`;

    config.headers['x-API-Version']=API_VERSION;  /* rewrite --- 5-03 */

    return config; 
 });

let refreshPromise = null;

const doRefresh = async ( ) => { 
    const refresh = getRefresh();
    if(!refresh) throw new Error('No refresh token');
    const {data} = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}${ENDPOINTS.refresh}`,
        { [REQ.refresh]: refresh } 
    )
    setAccess(data.access);
    return data.access;
 }

apiClient.interceptors.response.use(
    (res) => res.data,
    async (err) => { 
        const orig= err.config;
        const status = err.response?.status;

        if(status === 401 && !orig._retry){
            const refresh = getRefresh();
            /* rewrite --- 5-03 */

            orig._retry=true;
            try {
                if(!refreshPromise){
                    refreshPromise =doRefresh().finally(( ) => { refreshPromise=null; });
                }

                const newAcess = await refreshPromise;
                orig.headers.Authorization= 'Bearer ${newAccess}';
                return apiClient(orig);
            }catch {
                clearAll();
                window.location.href='/login';
                return Promise.reject({message:'Session expired'});
            }
        }

        /* rewrite ---- 5-03*/
        // handle backend field error
        const data = err.response?.data;
        let message='Network error';
        if (data?.message) {
            message=data.message;
            
        } else if (data && typeof data === 'object') {
            const firstKey = Object.keys(data)[0];
            if(firstKey && Array.isArray(data[firstKey])){
                message = data[firstKey][0];
            }
            
        }

        return Promise.reject({message});
     }

);


export default apiClient;
