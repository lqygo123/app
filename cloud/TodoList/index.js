const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()

const handles = {
  setTodoList: (data) => {

  },
  getTodoList: async (data) => {
    const res = await db.collection('todos').limit(200).get()
    return res
  }
}

// 云函数入口函数
exports.main = async (event, context) => {
  let res
  if (typeof handles[event.action] === 'function') {
    res = await handles[event.action](event.payload)
  } else {
    res = {
      errMsg: 'fail: invalid action'
    }
  }

  return res
}

