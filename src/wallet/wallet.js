import config from '../../config'
const app = getApp()

Page({
  data: {
    access_token: '',
    isRecord: false,
    wallet: true
  },
  onLoad: function (options) {
    const that = this
    const access_token = wx.getStorageSync('access_token') || ''
    if (access_token != '') {
      that.setData({
        access_token: access_token
      })
    }
  }
})
