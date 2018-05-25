import config from '../../config'
const app = getApp()

Page({
  data: {
    access_token: ''
  },
  onLoad: function (options) {
    const that = this
    const access_token = wx.getStorageSync('access_token') || ''
    if (access_token != '') {
      that.setData({
        access_token: access_token
      })
    }
  },
  queryProject: function () {
    wx.showToast({
      title: "功能开发中...",
      icon: "none"
    })
  }
})
