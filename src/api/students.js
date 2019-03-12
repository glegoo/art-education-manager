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

export function createArticle(data) {
  return request({
    url: '/students/add',
    method: 'get',
    data
  })
}

export function updateArticle(data) {
  return request({
    url: '/students/update',
    method: 'get',
    data
  })
}
