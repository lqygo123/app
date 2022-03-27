const dateToUnixStamp = (date) => {
  if (!date) return
  return new Date(`${date.year}-${date.month}-${date.date}`).getTime()
}

const unixStampToDate = (timeStamp) => {
  const date = new Date(parseInt(timeStamp))
  return {
    year: date.getFullYear(),
    month: date.getMonth() + 1,
    date: date.getDate(),
  }
}

const formateTime = (timeStamp) => {
  const date = new Date(parseInt(timeStamp))
  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
}

const conf = {
  data: {
    calendarConfig: {
      emphasisWeek: true,
      showHolidays: true,
      showFestival: true,
      autoChoosedWhenJump: true,
      disableMode: {
        type: 'before', // [‘before’, 'after']
        date: '2021-5-29' // 无该属性或该属性值为假，则默认为当天
      }
    },
    diaryMap: {},
    timelineList: [],
    timelinePhotoMap: {},
    currentDate: {},
  },

  setTimeline(currentDate) {
    const dateStr = `${currentDate.year}-${currentDate.month}-${currentDate.date}`
    if (this.data.diaryMap[dateStr]) {
      this.setData({
        timelineList: this.data.diaryMap[dateStr].diaryList,
      })
    } else {
      this.setData({
        timelineList: [],
        timelinePhotoMap: {}
      })
    }
  },

  afterTapDate(e) {
    console.log('afterTapDate', e.detail)
    const currentDate = e.detail
    this.setData({ currentDate })
    this.setTimeline(currentDate)
  },
  whenChangeMonth(e) {
    console.log('whenChangeMonth', e.detail)
  },
  whenChangeWeek(e) {
    console.log('whenChangeWeek', e.detail)
  },
  takeoverTap(e) {
    console.log('takeoverTap', e.detail)
  },
  addDiary() {
    const res = this.calendar.getSelectedDates()
    const dateUnixStamp = dateToUnixStamp(res[0])|| Date.now()
    wx.navigateTo({
      url: `/pages/addDiary/index?dateUnixStamp=${dateUnixStamp}`
    })
  },


  initCalendarData() {
    const that = this

    if (!this.data.currentDate.date) {
      this.setData({
        currentDate: unixStampToDate(Date.now())
      })
    }

    wx.cloud.callFunction({
      name: "diary",
      data: { action: "getAllDiary" },
      success: (res) => {
        console.log('getAllDiary', res)
        const allDiarys = res.result[0].data
        const diaryMap = {}
        let styleConfigList = []

        allDiarys.forEach(item => {
          diaryMap[formateTime(item.dateUnixStamp)] = item
          styleConfigList.push({
            ...unixStampToDate(item.dateUnixStamp),
            class: 'has-diary'
          })
        })

        this.setData({ diaryMap })
        this.calendar.setDateStyle(styleConfigList)
        this.setTimeline(this.data.currentDate)
      },
      fail: console.log
    })
  },

  previewImage(e) {
    const current = e.target.dataset.src
    const diaryid = e.target.dataset.diaryid

    const timelineItem = this.data.timelineList.find(item => item.id === diaryid)
    wx.previewImage({
      current,
      urls: (timelineItem && timelineItem.photos) || [current]
    })
  },

  afterCalendarRender(e) {
    const calendar = this.selectComponent('#calendar').calendar
    this.calendar = calendar
    this.initCalendarData()
  },


  onSwipe(e) {
    var styleConfigList = []
    Object.keys(this.data.diaryMap).forEach(key => {
      console.log(styleConfigList)
      styleConfigList.push({
        ...unixStampToDate(this.data.diaryMap[key].dateUnixStamp),
        class: 'has-diary'
      })
    })
    this.calendar.setDateStyle(styleConfigList)
  },

  onShow() {
    this.initCalendarData()
  }
}

Page(conf)
