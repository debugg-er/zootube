import axios from 'axios';
import qs from 'querystring';

const token = window.localStorage.getItem('token');

const client = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
  },
  paramsSerializer: (params) => qs.stringify(params),
});

client.interceptors.request.use((config) => {
  if (config.method === 'post' || config.method === 'patch') {
    switch (config.headers['Content-Type']) {
      case 'application/x-www-form-urlencoded':
        config.data = qs.stringify(config.data);
        break;

      case 'multipart/form-data':
        const form = new FormData();
        for (const key in config.data) {
          form.append(key, config.data[key]);
        }
        config.data = form;
        break;
    }
  }

  if (token) {
    config.headers = {
      ...config.headers,
      Authorization: 'Bearer ' + token,
    };
  }

  return config;
});

function appendUrl(obj: { [key: string]: any }): any {
  for (const key in obj) {
    if (
      obj[key] !== null &&
      Object.getPrototypeOf(obj[key]) === Object.prototype
    ) {
      appendUrl(obj[key]);
      continue;
    }

    if (key.includes('Path')) {
      obj[key] = process.env.REACT_APP_STATIC_URL + obj[key];
    }
  }

  return obj;
}

client.interceptors.response.use(
  (response) => {
    const data = response?.data?.data;
    if (!data) return undefined;

    return appendUrl(data);
  },
  (error) => {
    if (axios.isCancel(error)) throw error;
    else throw error.response;
  },
);

export default client;