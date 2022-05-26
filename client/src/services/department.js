// @ts-ignore

/* eslint-disable */


//import { request } from 'umi';
import request from 'umi-request';

// request拦截器, 改变url 或 options.
request.interceptors.request.use((url, options) => {
  let token = localStorage.getItem('token');
  if (null === token) {
      token = '';
  }
  const authHeader = { Authorization: `Bearer ${token}` };
  return {
    url: url,
    options: { ...options, interceptors: true, headers: authHeader },
  };
});

/** 获取规则列表 GET /api/rule */

export async function department(params, options) {
  return request('/api/department', {
    method: 'GET',
    params: { ...params },
    ...(options || {}),
  });
}

