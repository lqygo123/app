const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
const MAX_LIMIT = 100

const diaryExample = {
  dateUnixStamp: '11111111',
  diaryList: [
    {
      id: 'diaryKey',
      content: '',
      photos: [],
    }
  ],
}

const handles = {
  addDiary: async (payload) => {
    const { dateUnixStamp, diaryObj } = payload
    const diaryKey = Date.now() + Math.random().toString()
    let { UNIONID } = cloud.getWXContext()
    diaryObj.id = diaryKey
    diaryObj.sender = UNIONID

    const diaryCollection = db.collection('diary')

    let diaryRes = await diaryCollection.where({ dateUnixStamp }).get()
    let diaryList = []
    if (!diaryRes.data.length) {
      const emptyDiary = {
        dateUnixStamp,
        diaryList: [],
      }

      await diaryCollection.add({ data: emptyDiary })
      diary = JSON.parse(JSON.stringify(emptyDiary))
    } else {
      diaryList = diaryRes.data[0].diaryList
    }
    diaryList.push(diaryObj)
    await diaryCollection.where({ dateUnixStamp }).update({
      data: { diaryList }
    })
  },

  deleteDiary: async (payload) => {
    const { dateUnixStamp, diaryKey } = payload
    const diaryCollection = db.collection('diary')

    let diary = await diaryCollection.findOne({ dateUnixStamp })

    if (diary && diary.diaryList) {
      const idx = diary.diaryList.findIndex(item => item.id === diaryKey)
      if (idx > -1) {
        diary.diaryList.splice(idx, 1)
        diaryCollection.replaceOne({ dateUnixStamp }, diary)
      }
    }
  },

  getAllDiary: async () => {
    const countResult  = await db.collection('diary').count()
    const total = countResult.total
    const batchTimes = Math.ceil(total / 100)
    const tasks = []
  
    for (let i = 0; i < batchTimes; i++) {
      const promise = db.collection('diary').skip(i * MAX_LIMIT).limit(MAX_LIMIT).get()
      tasks.push(promise)
    }
    
    const allResults = await Promise.all(tasks)
    return allResults
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

