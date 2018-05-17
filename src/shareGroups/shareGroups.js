import config from '../../config'
const app = getApp()

Page({
  data: {
    rankings: true,
    userShareGroupsList: [],
    access_token: ''
  },
  onLoad: function (options) {
    var that = this
    that.loginUserShareGroups()
    // wx.login({
    //   success: res => {
    //     if (res.code) {
    //       wx.request({
    //         url: config.host + '/v1/users/wechat_login',
    //         method: 'POST',
    //         data: {
    //           code: res.code
    //         }, success: function (res) {
    //           that.setData({
    //             access_token: res.data.access_token
    //           })
    //           if (res.data.access_token != '') {
    //             that.setData({
    //               rankings: true
    //             })
    //             that.loginUserShareGroups()
    //           }
    //         }
    //       })
    //     } else {}
    //   },
    //   fail: res => {}
    // })
  },
  // 搜索进入程序 判断用户分享过哪些群
  loginUserShareGroups: function () {
    var that = this
    wx.request({
      url: config.host + '/v1/user_share_groups',
      method: 'GET',
      header: {
        'Authorization': app.globalData.access_token,
        'Content-Type': 'application/json'
      },
      success: function (res) {
        that.setData({
          userShareGroupsList: res.data.user_share_groups
        })
      }
    })
  }
})
