
import axios from 'axios';

export const baseURL = 'https://proxy.webshare.io/api/v2';
export const proxyKey = 'qp3ib2jesv7dxajv53uzdl4ri72h7zzr9n0h3del';

export default axios.create({
  baseURL,
  headers: {
    'Authorization': proxyKey,
  }
});

