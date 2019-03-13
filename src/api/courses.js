import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/courses/list',
    method: 'get',
    params: query
  })
}

export function fetchArticle(id) {
  return request({
    url: '/courses/detail',
    method: 'get',
    params: { id }
  })
}

export function fetchPv(pv) {
  return request({
    url: '/courses/pv',
    method: 'get',
    params: { pv }
  })
}

export function createArticle(data) {
  return request({
    url: '/courses/create',
    method: 'post',
    data
  })
}

export function updateArticle(data) {
  return request({
    url: '/courses/update',
    method: 'post',
    data
  })
}

export function fetchTypeList() {
  return request({
    url: '/courses/type_list',
    method: 'get',
    params: null
  })
}

export function addType(name) {
  return request({
    url: '/courses/add_type',
    method: 'get',
    params: name
  })
}
