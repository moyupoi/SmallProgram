import config from 'config'
//app.js
App({
  globalData: {
    userInfo: null,
    'encryptedData': '',
    'iv': ''
  },
  onLaunch: function () {
    var that = this
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    // 登录
    wx.login({
      success: res => {
        wx.getUserInfo({
          success: res => {
            // 可以将 res 发送给后台解码出 unionId
            this.globalData.userInfo = res.userInfo
            this.globalData.encryptedData = res.encryptedData
            this.globalData.iv = res.iv
            // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
            // 所以此处加入 callback 以防止这种情况
            if (this.userInfoReadyCallback) {
              this.userInfoReadyCallback(res)
            }
          },
          fail: function () {
            wx.showModal({
              title:'app',
              content:'getuserinfo fail'
            })
          }
        })
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        if (res.code) {
          // 发起网络请求
          wx.request({
            url: config.host + '/v1/users/wechat_login',
            method: 'POST',
            data: {
              code: res.code
            }, success: function (data) {
              // that.uploadWechat(data)
              // console.log(data)
            }
          })
        } else {
          console.log('登录失败！' + res.errMsg)
        }
      },
      fail: res => {
        wx.showToast(res);
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        // if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              console.log(res)
              this.globalData.userInfo = res.userInfo
              this.globalData.encryptedData = res.encryptedData
              this.globalData.iv = res.iv
              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }, fail: function () {
              wx.showToast(1)
            }
          })
        // } else {
        //   wx.showModal({
        //     title: '用户未授权',
        //     content: '如需正常使用阅读记录功能，请按确定并在授权管理中选中“用户信息”，然后点按确定。最后再重新进入小程序即可正常使用。',
        //     showCancel: true,
        //     success: function (res) {
        //       if (res.confirm) {
        //         console.log('用户点击确定')
        //         wx.openSetting({
        //           success: function success(res) {
        //             // console.log('openSetting success', res.authSetting);
        //           }
        //         })
        //       }
        //     }
        //   })
        // }

        //
        // if (!res.authSetting['scope.record']) {
        //   wx.authorize({//提前向用户发起授权请求
        //     scope: 'scope.record',//(必填)需要获取权限的scope
        //     success() {
        //       errMsg//调用结果
        //       // 用户已经同意小程序使用录音功能，后续调用 wx.startRecord 接口不会弹窗询问
        //       wx.startRecord()
        //     },
        //     fail/complete(){//接口调用失败/结束的回调函数
        //     }
        //   })
        // }
      }
    })
  },
  uploadWechat: function (data) {
    wx.request({
      url: config.host + '/v1/users/upload_wechat_userinfo',
      method: 'POST',
      header: {
        'Authorization': data.data.access_token,
        'Content-Type': 'application/json'
      },
      data: JSON.stringify({
        'encryptedData': this.globalData.encryptedData,
        'iv': this.globalData.iv
      }),
      success: function (data) {
        // console.log(data)
      }
    })
  }
})
