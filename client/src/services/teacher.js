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

export async function getTeacherById(params, options) {
  console.log(params)
  return request('/api/teacher/id', {
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

export async function editTeacher(body, options) {
  return request('/api/teacher/edit', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    data: body,
    ...(options || {})
  })
}

export async function addTeacher(body, options) {
  return request('/api/teacher/add', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    data: body,
    ...(options || {})
  })
}

export async function addTeacherMultiple(body, options) {
  return request('/api/teacher/add/multiple', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    data: body,
    ...(options || {})
  })
}

export async function deleteTeacher(body, options) {
  return request('/api/teacher/delete', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    data: body,
    ...(options || {})
  })
}

export async function deleteTeacherMultiple(body, options) {
  return request('/api/teacher/delete/multiple', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    data: body,
    ...(options || {})
  })
}

export async function termTeacher(body, options) {
  return request('/api/teacher/term', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    data: body,
    ...(options || {})
  })
}
