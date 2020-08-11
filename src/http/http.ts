import Axios from 'axios';

Axios.defaults.baseURL = process.env.REQ_URL;
Axios.defaults.timeout = 20000;
Axios.defaults.headers.common = {
  'Content-type': 'application/json;charset=UTF-8',
  'token': null,
  'website_code': process.env.WEB_CODE,
};

Axios.interceptors.request.use(
  config => {
    return config;
  },
  err => {},
);

const mocker = Axios.create();
