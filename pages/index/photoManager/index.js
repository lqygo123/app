// pages/index/photoManager/index.js
const { uploadFile } = require('../../../utils/util')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    imageList: []
  },

  onLoad: function (options) {
    this.fetchAlbum('home')
  },

  fetchAlbum(key) {
    const db = wx.cloud.database()
    const that = this
    db.collection('album').where({
      key: key
    }).get({
      success: function(res) {
        console.log(res.data[0])
        that.setData({
          imageList: res.data[0].imageList
        })
      }
    })
  },

  chooseImage() {
    const that = this
    wx.chooseImage({
      sourceType: ['album'],
      sizeType: ['compressed', 'original'],
      count: [9],
      success(res) {
        that.setData({
          imageList: [...that.data.imageList, ...res.tempFilePaths]
        })
      }
    })
  },

  previewImage(e) {
    const current = e.target.dataset.src

    wx.previewImage({
      current,
      urls: this.data.imageList
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

  handleSave() {
    this.saveAlbum()
  },

  saveAlbum() {
    const imageList = this.data.imageList
    let i = 0

    const promises = []
    const rawFiles = []
    while (i < imageList.length) {
      if (!imageList[i].startsWith('cloud')) {
        const promise = uploadFile(imageList[i])
        promises.push(promise)
        rawFiles.push(imageList[i])
      }
      i ++
    }

    Promise.all(promises).then(res => {
      res.forEach((val, idx) => {
        const imgIdx = imageList.findIndex(item => item === rawFiles[idx])
        imageList[imgIdx] = val
      })

      const db = wx.cloud.database()
      db.collection('album').where({
        key: 'home'
      }).update({
        data: { imageList }
      }).then(res => {
        wx.showToast({
          title: '保存成功',
        })
      })
    })
  }
})