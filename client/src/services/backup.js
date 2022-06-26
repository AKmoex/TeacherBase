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

export async function backup(params, options) {
  console.log(params)
  return request('/api/backup', {
    method: 'GET',
    responseType: 'blob',
    params: { ...params },
    ...(options || {})
  })
}
export async function backupSystem(params, options) {
  return request('/api/backup/system', {
    method: 'GET',

    params: { ...params },
    ...(options || {})
  })
}
