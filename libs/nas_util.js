import XmlParsar from 'fast-xml-parser';
import https from 'https';
import Axios from 'axios';
import config from '../config';

const axiosInstance = Axios.create({
  baseURL: `${config.nasProtocol}${config.nasUrl}`,
  httpsAgent: new https.Agent({
    rejectUnauthorized: false,
  }),
});

export const login = (user, pwd) => axiosInstance
  .post('/cgi-bin/authLogin.cgi', `user=${user}&pwd=${Buffer.from(pwd).toString('base64')}`)
  .then((res) => XmlParsar.parse(res.data).QDocRoot.authSid);

export const createFolder = (sid, folderName) => axiosInstance.post(`/cgi-bin/filemanager/utilRequest.cgi?func=createdir&sid=${sid}`, `dest_path=%2FDownload&dest_folder=${folderName}`)
  .then((data) => data.data).then((data) => {
    if (data.status !== 1) return 1;
    return 0;
  });

export const download = (sid, folderName, urls) => axiosInstance.post('/downloadstation/V4/Task/AddUrl', `temp=Download&move=Download%2F${folderName}&url=${urls.slice(0, 30).join('&url=')}&sid=${sid}`).then((data) => data.data).then((data) => {
  if (data.error !== 0) return 2;
  return true;
});
