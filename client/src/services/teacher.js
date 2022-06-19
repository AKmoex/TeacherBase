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

export async function addTeacherDetails(body, options) {
  return request('/api/teacher/add/details', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    data: body,
    ...(options || {})
  })
}
export async function addTeacher(body, options) {
  console.log('你')
  return request('/api/teacher/add', {
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
