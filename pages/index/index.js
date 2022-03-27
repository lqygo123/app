// index.js
// 获取应用实例
const app = getApp()

Page({
  data: {
    days: parseInt((Date.now() - 1622217600000) / (24 * 3600 * 1000)),
    imageList: []
  },

  onShow() {
    this.fetchAlbum('home')
  },

  routeToManagerPhoto() {
    wx.navigateTo({
      url: '/pages/index/photoManager/index'
    })
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
})
