const dateToUnixStamp = (date) => {
  return new Date(`${date.year}-${date.month}-${date.date}`).getTime()
}

const unixStampToDate = (timeStamp) => {
  const date = new Date(timeStamp)
  return {
    year: date.getFullYear(),
    month: date.getMonth(),
    year: date.getDate(),
  }
}

const formateTime = (timeStamp) => {
  const date = new Date(timeStamp)
  return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`
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

    diaryList: {},
  },
  afterTapDate(e) {
    console.log('afterTapDate', e.detail)
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
    const dateUnixStamp = dateToUnixStamp(res[0] || Date.now())
    wx.navigateTo({
      url: `/pages/addDiary/index?dateUnixStamp=${dateUnixStamp}`
    })
  },
  afterCalendarRender(e) {
    console.log('afterCalendarRender', e)
    const calendar = this.selectComponent('#calendar').calendar
    this.calendar = calendar
    console.log(calendar)

    calendar.setDateStyle([
      {
        year: 2021,
        month: 11,
        date: 19,
        class: 'orange-date other-class' // 页面定义的 class，多个 class 由空格隔开
      }
    ])
  },



  onSwipe(e) {
    console.log('onSwipe', e)
  },
}

Page(conf)
