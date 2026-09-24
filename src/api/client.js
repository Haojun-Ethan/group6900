/* Rewrite ---- 4-01 */

import axios from "axios";

import { getAccess, getRefresh, setAccess, clearAll} from '../utils/storage';
import { ENDPOINTS, REQ } from "../config/apiContract";

const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    timeout:10000,
    header:{'Content-Type':'application/json'}
})

apiClient.interceptors.request.use((config) => { 
    const access = getAccess();
    if(access) config.headers.Authorization = `Bearer ${access}`;
    return config; 
 });

apiClient.interceptors.response.use(
    (res) => res.data,
    async (err) => { 
        const orig= err.config;
        const status = err.response?.status;

        if(status === 401 && !orig._retry){
            const refresh = getRefresh();
            if(!refresh){
                clearAll();
                window.location.href='/login';
                return Promise.reject(err.response?.data || {message:'Unauthorized'});
            }

            orig._retry = true;
            try{
                const {data} = await axios.post(
                    `${import.meta.env.VITE_API_BASE_URL}${ENDPOINTS.refresh}`,
                    { [REQ.refresh]: refresh }
                );

                setAccess(data.access);
                orig.headers.Authorization = `Bearer ${data.access}`;
                return apiClient(orig);
            } catch {
                clearAll();
                window.location.href = '/login';
                return Promise.reject({message:'Session expired.'});
            }
        }

        return Promise.reject(err.response?.data || {message:'Network error.'});
     }

);


export default apiClient;
