import Mock from 'mockjs'
import { param2Obj } from '@/utils'

const List = []
const count = 8

// const baseContent = '<p>我是测试数据我是测试数据</p><p><img src="https://wpimg.wallstcn.com/4c69009c-0fd4-4153-b112-6cb53d1cf943"></p>'
// const image_uri = 'https://wpimg.wallstcn.com/e4558086-631c-425c-9430-56ffb46e70b3'

for (let i = 0; i < count; i++) {
  const courseList = [
    '小提琴',
    '乐理',
    '钢琴',
    '吉他',
    '尤克里里',
    '架子鼓',
    '萨克斯',
    '古筝'
  ]

  List.push(Mock.mock({
    id: '@increment',
    course: courseList[i],
    ps: Mock.Random.string(10)
  }))
}

export default {
  getList: config => {
    const { name, course, teacher, status, page = 1, limit = 20, sort } = param2Obj(config.url)
    let mockList = List.filter(item => {
      if (course && item.course !== Number(course)) return false
      if (name && item.name !== name) return false
      if (teacher && item.teacher !== Number(teacher)) return false
      if (status) {
        switch (status) {
          case '0':
            if (item.left_times < 5) return false
            break
          case '1':
            if (item.left_times === 0 || item.left_times >= 5) return false
            break
          case '2':
            if (item.left_times !== 0) return false
            break

          default:
            break
        }
      }
      return true
    })

    if (sort === '-id') {
      mockList = mockList.reverse()
    }

    const pageList = mockList.filter((item, index) => index < limit * page && index >= limit * (page - 1))

    return {
      code: 20000,
      data: {
        total: mockList.length,
        items: pageList
      }
    }
  },
  getPv: () => ({
    pvData: [{ key: 'PC', pv: 1024 }, { key: 'mobile', pv: 1024 }, { key: 'ios', pv: 1024 }, { key: 'android', pv: 1024 }]
  }),
  getArticle: (config) => {
    const { id } = param2Obj(config.url)
    for (const article of List) {
      if (article.id === +id) {
        return article
      }
    }
  },
  createArticle: () => ({
    data: 'success'
  }),
  updateArticle: () => ({
    code: 20000,
    data: 'success'
  })
}
