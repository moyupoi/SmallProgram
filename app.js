import config from 'config'
import { resetLogin } from '/layouts/assets/javascript/bindMethods.js'
//app.js
App({
  globalData: {
    userInfo: null,
    encryptedData: '',
    iv: '',
    shareEncryptedData: '',
    shareIv: '',
    access_token: '',
    employId: '',
    shareId: '',
    shareTicket: ''
  },
  onLaunch: function (options) {


    // const that = this
    // // 展示本地存储能力
    // const access_token = wx.getStorageSync('access_token') || ''
    // // wx.setStorageSync('logs', logs)
    // if (access_token == '') {
    //   // 登录
    //   wx.login({
    //     success: res => {
    //       // 发送 res.code 到后台换取 openId, sessionKey, unionId
    //       if (res.code) {
    //         // 发起网络请求
    //         wx.request({
    //           url: config.host + '/v1/users/wechat_login',
    //           method: 'POST',
    //           data: {
    //             code: res.code
    //           }, success: function (res) {
    //             wx.setStorage({
    //               key: "access_token",
    //               data: res.data.access_token
    //             })
    //           }
    //         })
    //       } else {
    //         // console.log('登录失败！' + res.errMsg)
    //       }
    //     },
    //     fail: res => {
    //       wx.showToast(res);
    //     }
    //   })
    // }
  },
  onShow: function (options) {
    var that = this
    wx.checkSession({
      success: function(){
        //session_key 未过期，并且在本生命周期一直有效
      },
      fail: function(){
        // session_key 已经失效，需要重新执行登录流程
        resetLogin('')
      }
    })

    // 分享获取群信息
    wx.showShareMenu({
      withShareTicket: true
    })
    that.globalData.shareTicket = options.shareTicket
    if (options.scene == 1044) {
      wx.getShareInfo({
        shareTicket: options.shareTicket,
        success: function(res) {
          that.globalData.shareEncryptedData = res.encryptedData
          that.globalData.shareIv = res.iv
        }
      })
    }
  }
})
