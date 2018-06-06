import config from '../../config'
import { resetLogin } from '../../layouts/assets/javascript/bindMethods.js'

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
    } else {
      resetLogin(that)
    }
  }
})
