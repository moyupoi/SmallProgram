import config from '../../config'
const app = getApp()
import { resetLogin, access_token } from '../../layouts/assets/javascript/bindMethods.js'

Page({
  data: {
    access_token: '',
    isFriends: true
  },
  onLoad: function (options) {
    const that = this
    const access_token = wx.getStorageSync('access_token') || ''
    if (access_token != '') {
      that.setData({
        access_token: access_token
      })
      that.inviteList()
    } else {
      resetLogin(that)
    }
  },
  inviteList: function () {
    const that = this
    wx.request({
      url: config.host + '/v1/user_invite_records/invite_list',
      method: 'GET',
      header: {
        'Authorization': that.data.access_token,
        'Content-Type': 'application/json'
      },
      success: function (res) {
        if (res.statusCode == '401') {
          resetLogin(that)
        }
      },
      fail: function(res) {
      }
    })
  },
  helpBtn: function (e) {
    const that = this
    switch (e.target.dataset.help) {
      case '0':
        that.setData({
          isFriends: true
        })
        break
      case '1':
        that.setData({
          isFriends: false
        })
        break
      default:
    }
  }
})
