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

/** 获取所有部门 GET /api/department */
export async function department(params, options) {
  return request('/api/department', {
    method: 'GET',
    params: { ...params },
    ...(options || {})
  })
}

/** 创建新的部门 POST /api/department/create */
export async function createDepartment(body, options) {
  return request('/api/department/create', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    data: body,
    ...(options || {})
  })
}
