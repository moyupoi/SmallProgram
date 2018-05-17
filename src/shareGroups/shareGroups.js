import config from '../../config'
const app = getApp()

Page({
  data: {
    rankings: true,
    userShareGroupsList: []
    // rankingsList: []
  },
  onLoad: function (options) {
    var that = this
    if (app.employIdCallback) {
      that.loginUserShareGroups()
    } else {
      app.employIdCallback = res => {
        that.loginUserShareGroups()
        // if (app.globalData.shareEncryptedData != '') {
        //   that.uploadGroupInfo(res.encryptedData, res.iv)
        // }
      }
    }

  },
  // 解析
  uploadWechat: function (encryptedData, iv) {
    wx.request({
      url: config.host + '/v1/users/upload_wechat_userinfo',
      method: 'POST',
      header: {
        'Authorization': app.globalData.access_token,
        'Content-Type': 'application/json'
      },
      data: JSON.stringify({
        'encryptedData': encryptedData,
        'iv': iv
      }),
      success: function (obj) {
        console.log(data)
      }
    })
  },
  // 解析信息
  uploadGroupInfo: function (encryptedData, iv) {
    var that = this
    wx.request({
      url: config.host + '/v1/user_share_groups/upload_group_info',
      method: 'POST',
      header: {
        'Authorization': app.globalData.access_token,
        'Content-Type': 'application/json'
      },
      data: JSON.stringify({
        'encryptedData': encryptedData,
        'iv': iv
      }),
      success: function (obj) {
        console.log(obj.data)
        that.userShareGroups(obj.data.open_gid)
      }
    })
  },
  // 获取排行榜
  userShareGroups: function (openGid) {
    var that = this
    console.log(openGid)
    wx.request({
      url: config.host + '/v1/user_share_groups/top',
      method: 'GET',
      data: {
        'open_gid': openGid
      },
      header: {
        'Authorization': app.globalData.access_token,
        'Content-Type': 'application/json'
      },
      success: function (res) {
        // debugger
        // that.setData({
        //   rankings: res.data.is_has_test
        // })
        console.log(res)
        debugger
        let userList = []
        if (res.data.users != undefined && res.data.users.length > 0) {
          res.data.users.map((item, i) => {
            if (item.name != null && item.avatar_url != null && item.answer_name ) {
              userList.push(item)
            }
          })
          // that.setData({
          //   rankingsList: userList
          // })
        }
      },
      fail: function(res) {
        debugger
      }
    })
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
        console.log(res)
      }
    })
  }
})
