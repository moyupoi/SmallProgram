import config from '../../config'
const app = getApp()
import { resetLogin } from '../../layouts/assets/javascript/bindMethods.js'

Page({
  data: {
    access_token: '',
    shareid: '',
    helpInit: ''
  },
  onLoad: function (options) {
    const that = this
    const access_token = wx.getStorageSync('access_token') || ''
    if (access_token != '' && options.shareid) {
      that.setData({
        access_token: access_token,
        shareid: options.shareid
      })
      that.helpInit()
    } else {
      resetLogin(that)
    }
  },
  helpInit: function () {
    const that = this
    wx.request({
      url: config.host + '/v1/user_invite_records/' + that.data.shareid + '/help_init',
      method: 'GET',
      header: {
        'Authorization': that.data.access_token,
        'Content-Type': 'application/json'
      },
      success: function (res) {
        if (res.statusCode == '401') {
          resetLogin
        }
        that.setData({
          helpInit: res.data
        })
      },
      fail: function(res) {

      }
    })
  },
  helpBtn: function (e) {
    const that = this
    if (e.detail.errMsg == "getUserInfo:ok") {
      that.uploadWechat(e.detail.encryptedData, e.detail.iv)
      wx.request({
        url: config.host + '/v1/user_invite_records/' + that.data.shareid + '/help',
        method: 'POST',
        header: {
          'Authorization': that.data.access_token,
          'Content-Type': 'application/json'
        },
        success: function (res) {
          if (res.statusCode == '401') {
            that.resetLogin()
          }
          wx.showModal({
            title: '提示',
            content: res.data.message,
            cancelText: '取消',
            confirmText: '回到首页',
            success: function(res) {
              if (res.confirm) {
                wx.switchTab({
                  url:'/src/home/home'
                })
              } else if (res.cancel) {

              }
            }
          })
        },
        fail: function(res) {

        }
      })
    }
  },
  // 更新用户信息
  uploadWechat: function (encryptedData, iv) {
    var that = this
    wx.request({
      url: config.host + '/v1/users/upload_wechat_userinfo',
      method: 'POST',
      header: {
        'Authorization': that.data.access_token,
        'Content-Type': 'application/json'
      },
      data: JSON.stringify({
        'encryptedData': encryptedData,
        'iv': iv
      }),
      success: function (res) {
        // console.log(res.data)
      }
    })
  }
})
