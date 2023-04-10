import axios from 'axios';
import type {AxiosResponse} from 'axios';
import {apiBaseUrl, resBaseUrl} from '../../config/url';

const axiosInstance = axios.create({
  baseURL: apiBaseUrl,
  timeout: 12000,
});

axiosInstance.interceptors.request.use(
  config => config,
  () => Promise.reject('请求失败'),
);

axiosInstance.interceptors.response.use(
  (resp: AxiosResponse<AxiosTypes.ApiResult<any>>) => {
    const {data: respData} = resp;
    if (respData) {
      const {code, msg, data} = respData;
      if (code !== 200) {
        throw new Error(msg);
      } else {
        return data;
      }
    }
    return null;
  },
  err => Promise.reject(err.message),
);

const checkUpdate: (
  data: AxiosTypes.CheckUpdateProps,
) => Promise<AxiosTypes.CheckUpdateResult> = data => {
  return axiosInstance.post('/update', data);
};

const getAnnouncement: () => Promise<AxiosTypes.GetAnnouncementResult> = () =>
  axiosInstance.get(`${resBaseUrl}/announcement.json`);

export {checkUpdate, getAnnouncement};
