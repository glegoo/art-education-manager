import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/students/list',
    method: 'get',
    params: query
  })
}

export function fetchArticle(id) {
  return request({
    url: '/students/detail',
    method: 'get',
    params: { id }
  })
}

export function fetchPv(pv) {
  return request({
    url: '/students/pv',
    method: 'get',
    params: { pv }
  })
}

export function addStudent(data) {
  return request({
    url: '/students/add',
    method: 'get',
    params: data
  })
}

export function updateStudent(data) {
  return request({
    url: '/students/update',
    method: 'get',
    params: data
  })
}
