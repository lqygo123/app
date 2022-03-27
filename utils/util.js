const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return `${[year, month, day].map(formatNumber).join('/')} ${[hour, minute, second].map(formatNumber).join(':')}`
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : `0${n}`
}

const uploadFile = (filePath) => {
  console.log('upload', filePath)
  return new Promise((resolve, reject) => {
    wx.cloud.uploadFile({
      cloudPath: `home/${filePath.slice(20)}`, // 上传至云端的路径
      filePath: filePath, // 小程序临时文件路径
      success: res => {
        resolve(res.fileID)
      },
      fail: console.error
    })
  })
}

module.exports = {
  formatTime,
  uploadFile
}
