// pages/todo/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    todolist: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.fetchTodoList()
  },

  initTodoList() {
    const db = wx.cloud.database()
    const todoDB = db.collection('todos')
    // const originList = [
    //   "一起去电影院看电影",
    //   "一起穿情侣装逛街",
    //   "一起去一趟迪士尼乐园",
    //   "一起去游泳",
    //   "一起唱歌并录下来",
    //   "一起在厨房做饭",
    //   "珠光晚餐",
    //   "一起过生日",
    //   "一起打扫卫生",
    //   "给对方写信，并读给TA",
    //   "一起去鬼屋",
    //   "一起坐缆车",
    //   "一起养宠物",
    //   "一起研究口红色号",
    //   "给对方化妆",
    //   "为对方涂指甲",
    //   "一起做陶艺",
    //   "一起锻炼身体",
    //   "一起去吃一次全家桶",
    //   "一起熬夜通宵跨年",
    //   "一起去旅游",
    //   "一起去爬山",
    //   "一起坐摩天轮",
    //   "一起拍视频记录生活",
    //   "为对方刷牙亲亲",
    //   "一起去看海，去沙滩",
    //   "互相穿对方衣服，拍照",
    //   "一起逛超市买好吃的",
    //   "一起做热气球",
    //   "一起看书",
    //   "一起在下雨天追剧",
    //   "一起做蛋糕",
    //   "一起看日出日落",
    //   "一起上下班",
    //   "一起画画",
    //   "帮彼此吹头发",
    //   "公主抱",
    //   "一起玩一次游戏机",
    //   "一起坐飞机",
    //   "一起种花",
    //   "用情侣手机壳",
    //   "一起去海底世界",
    //   "一起蹦迪",
    //   "一起打牌",
    //   "一起去天安门升旗",
    //   "讲故事哄我入睡",
    //   "一起看烟花",
    //   "一起吃火锅",
    //   "一起庆祝恋爱纪念日",
    //   "一起去教堂",
    //   "一起看雪堆雪人",
    //   "一起换发型剪头发",
    //   "一起和朋友们吃法",
    //   "一起跳舞",
    //   "一起听音乐，同一首",
    //   "一起做一次船",
    //   "一起露营，住帐篷",
    //   "一起DIY手工",
    //   "一起去我们上过的小中高中大学",
    //   "一起在沙发上躺着",
    //   "给对方准备礼物",
    //   "一起睡懒觉赖床",
    //   "偷偷为对方买喜欢又舍不得买的东西",
    //   "互换角色",
    //   "打一整晚电话",
    //   "一起为布置小家出主意",
    //   "给对方准备一次浪漫的告白",
    //   "一起去游乐园",
    //   "陪对方演一次喜欢的片段",
    //   "陪对方看比赛",
    //   "一起去选一束花",
    //   "一起去跳一次广场舞",
    //   "一起去见证别人的婚礼",
    //   "为对方按摩",
    //   "一起放风筝",
    //   "一起吐槽对方的缺点",
    //   "接对方下班回家",
    //   "当一天陌生人不说话",
    //   "为对方做便当",
    //   "一起存钱",
    //   "一起敷面膜",
    //   "自驾游",
    //   "一起去动物园",
    //   "一起骑自行车",
    //   "拍照片洗照片贴房间",
    //   "演唱会",
    //   "为对方录对ta说的话",
    //   "拍写真",
    //   "为对方挑选衣服",
    //   "一起听一次相声",
    //   "玩一次真心话大冒险,坦白局",
    //   "一起去许愿池许愿",
    //   "住一次五星级酒店看夜景",
    //   "一起去见父母",
    //   "一起挑选戒指",
    //   "一起挑选婚纱",
    //   "一起为我们的小家添置物品",
    //   "领证",
    //   "结婚",
    // ]

    const originList = ["一起去看樱花"]

    originList.forEach(item => {
      todoDB.add({
        data: {
          todo: item,
          done: false
        }
      })
    })
  },

  handleTodoTab(event) {
    const dataSet = event.currentTarget.dataset
    console.log('handleTodoTab handleTodoTab', dataSet)
    this.updateTodoList(dataSet.id, {
      done: !dataSet.done
    })
  },

  fetchTodoList() {
    const db = wx.cloud.database()
    wx.cloud.callFunction({
      name: "TodoList",
      data: { action: "getTodoList" },
      success: (res) => {
        this.setData({
          todolist: res.result.data
        })
      },
      fail: console.log
    })
    // db.collection('todos').limit(200).get().then((res => {
    //   this.setData({
    //     todolist: res.data
    //   })
    // }))
  },

  updateTodoList(id, data) {
    const db = wx.cloud.database()
    db.collection('todos').where({
      _id: id
    }).update({
      data
    })
  },
})