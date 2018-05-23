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
  progressQuery: function () {
    wx.showModal({
      title: '查询进度',
      content: '您的查询进度已经下发到短信，请注意查收',
      showCancel: false,
      success: function(res) {

      }
    })
  }
})
