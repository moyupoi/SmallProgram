import config from 'config'
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
    var that = this
    // 展示本地存储能力
    // var logs = wx.getStorageSync('logs') || []
    // logs.unshift(Date.now())
    // wx.setStorageSync('logs', logs)
    // 登录
    wx.login({
      success: res => {
        // wx.getUserInfo({
        //   success: res => {
        //     // 可以将 res 发送给后台解码出 unionId
        //     this.globalData.userInfo = res.userInfo
        //     this.globalData.encryptedData = res.encryptedData
        //     this.globalData.iv = res.iv
        //     // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
        //     // 所以此处加入 callback 以防止这种情况
        //     if (this.userInfoReadyCallback) {
        //       this.userInfoReadyCallback(res)
        //     }
        //   },
        //   fail: function () {
        //
        //   }
        // })
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        if (res.code) {
          // 发起网络请求
          wx.request({
            url: config.host + '/v1/users/wechat_login',
            method: 'POST',
            data: {
              code: res.code
            }, success: function (obj) {
              that.globalData.access_token = obj.data.access_token
              // 回调方法
              that.globalData.employId = obj.employId
              if (that.employIdCallback) {
                that.employIdCallback()
              }
              if (that.globalData.encryptedData != '') {
                that.uploadWechat(obj.data.access_token)
              }
            }
          })
        } else {
          // console.log('登录失败！' + res.errMsg)
        }
      },
      fail: res => {
        wx.showToast(res);
      }
    })
  },
  onShow: function (options) {
    var that = this
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
          // 回调方法
          // if (that.employIdCallback) {
          //   that.employIdCallback(res)
          // }
        }
      })
    }
  },
  uploadWechat: function (access_token) {
    wx.request({
      url: config.host + '/v1/users/upload_wechat_userinfo',
      method: 'POST',
      header: {
        'Authorization': access_token,
        'Content-Type': 'application/json'
      },
      data: JSON.stringify({
        'encryptedData': this.globalData.encryptedData,
        'iv': this.globalData.iv
      }),
      success: function (obj) {
        // console.log(data)
      }
    })
  }
})
