import Mock from 'mockjs'
// import loginAPI from './login'
// import studentsAPI from './students'
// import coursesAPI from './courses'
// import teachersAPI from './teachers'
import remoteSearchAPI from './remoteSearch'
import transactionAPI from './transaction'

// 修复在使用 MockJS 情况下，设置 withCredentials = true，且未被拦截的跨域请求丢失 Cookies 的问题
// https://github.com/nuysoft/Mock/issues/300
Mock.XHR.prototype.proxy_send = Mock.XHR.prototype.send
Mock.XHR.prototype.send = function() {
  if (this.custom.xhr) {
    this.custom.xhr.withCredentials = this.withCredentials || false
  }
  this.proxy_send(...arguments)
}

// Mock.setup({
//   timeout: '350-600'
// })

// 登录相关
// Mock.mock(/\/login\/login/, 'post', loginAPI.loginByUsername)
// Mock.mock(/\/login\/logout/, 'post', loginAPI.logout)
// Mock.mock(/\/user\/info\.*/, 'get', loginAPI.getUserInfo)

// 搜索相关
Mock.mock(/\/search\/user/, 'get', remoteSearchAPI.searchUser)

// 账单相关
Mock.mock(/\/transaction\/list/, 'get', transactionAPI.getList)

// 课程相关
// Mock.mock(/\/courses\/list/, 'get', coursesAPI.getList)
// Mock.mock(/\/courses\/detail/, 'get', coursesAPI.getArticle)
// Mock.mock(/\/courses\/pv/, 'get', coursesAPI.getPv)
// Mock.mock(/\/courses\/create/, 'post', coursesAPI.createArticle)
// Mock.mock(/\/courses\/update/, 'post', coursesAPI.updateArticle)

// 学生相关
// Mock.mock(/\/students\/list/, 'get', studentsAPI.getList)
// Mock.mock(/\/students\/detail/, 'get', studentsAPI.getArticle)
// Mock.mock(/\/students\/pv/, 'get', studentsAPI.getPv)
// Mock.mock(/\/students\/create/, 'post', studentsAPI.createArticle)
// Mock.mock(/\/students\/update/, 'post', studentsAPI.updateArticle)

// 教师相关
// Mock.mock(/\/teachers\/list/, 'get', teachersAPI.getList)
// Mock.mock(/\/teachers\/detail/, 'get', teachersAPI.getArticle)
// Mock.mock(/\/teachers\/pv/, 'get', teachersAPI.getPv)
// Mock.mock(/\/teachers\/create/, 'post', teachersAPI.createArticle)
// Mock.mock(/\/teachers\/update/, 'post', teachersAPI.updateArticle)

export default Mock
