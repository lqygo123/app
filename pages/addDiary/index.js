// pages/API/image/image.js
const sourceType = [['camera'], ['album'], ['camera', 'album']]
const sizeType = [['compressed'], ['original'], ['compressed', 'original']]

const { uploadFile } = require('../../utils/util.js')

Page({
  data: {
    imageList: [],
    diaryText: "",


    sourceTypeIndex: 2,
    sourceType: ['拍照', '相册', '拍照或相册'],

    sizeTypeIndex: 2,
    sizeType: ['压缩', '原图', '压缩或原图'],

    countIndex: 8,
    count: [1, 2, 3, 4, 5, 6, 7, 8, 9],
    dateUnixStamp: 0,
  },

  onLoad(query) {
    console.log("query", query);
    this.data.dateUnixStamp = query.dateUnixStamp
  },

  handleInput(event) {
    this.setData({
      diaryText: event.detail.value
    })
  },

  chooseImage() {
    const that = this
    wx.chooseImage({
      sourceType: sourceType[this.data.sourceTypeIndex],
      sizeType: sizeType[this.data.sizeTypeIndex],
      count: this.data.count[this.data.countIndex],
      success(res) {
        that.setData({
          imageList: [...that.data.imageList, ...res.tempFilePaths]
        })
      }
    })
  },

  handleDelete(e) {
    const current = e.target.dataset.src
    const idx = this.data.imageList.findIndex(item => item === current)
    if (idx > -1) {
      this.data.imageList.splice(idx, 1)
      this.setData({
        imageList: this.data.imageList
      })
    }
  },

  previewImage(e) {
    const current = e.target.dataset.src

    wx.previewImage({
      current,
      urls: this.data.imageList
    })
  },

  saveDiary() {
    console.log(this.data.imageList)
    console.log(this.data.diaryText)

    const imageList = this.data.imageList
    let i = 0

    const promises = []
    while (i < imageList.length) {
      const promise = uploadFile(imageList[i])
      promises.push(promise)
      i ++
    }

    const that = this
    Promise.all(promises).then(res => {
      const payload = {
        dateUnixStamp: that.data.dateUnixStamp,
        diaryObj: {
          content: that.data.diaryText,
          photos: res
        }
      }
      wx.cloud.callFunction({
        name: "diary",
        data: { action: "addDiary", payload},
        success: (res) => {
          console.log('payload success', payload)
          wx.navigateBack()
        },
        fail: console.log
      })
    })
  }
})
