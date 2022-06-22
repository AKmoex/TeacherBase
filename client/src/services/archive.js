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

/** 获取所有科研项目 GET /api/archive */
export async function archive(params, options) {
  return request('/api/archive', {
    method: 'GET',
    params: { ...params },
    ...(options || {})
  })
}

export async function addArchive(body, options) {
  return request('/api/archive/add', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    data: body,
    ...(options || {})
  })
}

export async function editArchive(body, options) {
  return request('/api/archive/edit', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    data: body,
    ...(options || {})
  })
}
/** 删除指定的某个部门 POST /api/department/delete */
export async function deleteArchive(body, options) {
  return request('/api/archive/delete', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    data: body,
    ...(options || {})
  })
}
