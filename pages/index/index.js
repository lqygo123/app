// index.js
// 获取应用实例
const app = getApp()

Page({
  data: {
    days: parseInt((Date.now() - 1622217600000) / (24 * 3600 * 1000)),
  }
})
