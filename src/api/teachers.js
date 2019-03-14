import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/teachers/list',
    method: 'get',
    params: query
  })
}

export function fetchArticle(id) {
  return request({
    url: '/teachers/detail',
    method: 'get',
    params: { id }
  })
}

export function fetchPv(pv) {
  return request({
    url: '/teachers/pv',
    method: 'get',
    params: { pv }
  })
}

export function addTeacher(data) {
  return request({
    url: '/teachers/add',
    method: 'get',
    params: data
  })
}

export function updateTeacher(data) {
  return request({
    url: '/teachers/update',
    method: 'get',
    params: data
  })
}
