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

/** 获取所有教师 GET /api/teacher */
export async function teacher(params, options) {
  console.log(params)
  return request('/api/teacher', {
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

/** 删除指定的某个部门 POST /api/department/delete */
export async function deleteDepartment(body, options) {
  return request('/api/department/delete', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    data: body,
    ...(options || {})
  })
}

/** 删除指定的多个部门 POST /api/department/delete */
export async function deleteDepartmentMultiple(body, options) {
  return request('/api/department/delete/multiple', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    data: body,
    ...(options || {})
  })
}