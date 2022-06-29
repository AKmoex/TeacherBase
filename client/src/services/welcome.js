// @ts-ignore

/* eslint-disable */

//import { request } from 'umi';
import request from 'umi-request'

// request拦截器, 改变url 或 options.
request.interceptors.request.use((url, options) => {
  let token = localStorage.getItem('token')
  if (null === token) {
    token = ''
  }
  const authHeader = { Authorization: `Bearer ${token}` }
  return {
    url: url,
    options: { ...options, interceptors: true, headers: authHeader }
  }
})

export async function welcome(params, options) {
  console.log(params)
  return request('/api/welcome', {
    method: 'GET',
    params: { ...params },
    ...(options || {})
  })
}
