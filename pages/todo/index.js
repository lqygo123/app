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
    this.setData({
      'todolist': this.fetchTodoList()
    })
  },

  fetchTodoList() {
    return [
      {
        name: '12313',
        statues: true
      },
      {
        name: '33333333',
        statues: true
      },
      {
        name: '44444444444444',
        statues: true
      },
      {
        name: '555555555',
        statues: true
      },
      {
        name: '66666',
        statues: true
      },
      {
        name: '777',
        statues: true
      },
      {
        name: '88888888',
        statues: true
      },
    ]
  },

  updateTodoList() {

  },
})