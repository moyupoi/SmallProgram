import config from '../../config'
const app = getApp()

Page({
  data: {
    isAccess_token: true,
    portraitPath: '',
    rankings: true,
    rankingsList: [],
    userShareGroupsList: [],
    access_token: ''
  },
  onLoad: function (options) {
    var that = this
    // 埋点
    wx.reportAnalytics('page_view', {
      page_view_name: '首页'
    })

    // if (app.employIdCallback) {
    //   this.setData({
    //     isAccess_token: false
    //   })
    //   that.loginUserShareGroups()
    // } else {
    //   app.employIdCallback = res => {
    //     this.setData({
    //       isAccess_token: false
    //     })
    //     that.loginUserShareGroups()
    //   }
    // }


    wx.login({
      success: res => {
        if (res.code) {
          wx.request({
            url: config.host + '/v1/users/wechat_login',
            method: 'POST',
            data: {
              code: res.code
            }, success: function (res) {
              that.setData({
                access_token: res.data.access_token
              })
              if (res.data.access_token != '') {
                that.setData({
                  rankings: true
                })
                // 搜索进入的用户
                that.loginUserShareGroups()
                if (app.globalData.shareEncryptedData && app.globalData.shareIv) {
                  // 打开群分享链接进入的用户
                  that.uploadGroupInfo(app.globalData.shareEncryptedData, app.globalData.shareIv)
                }
              }
            }
          })
        } else {}
      },
      fail: res => {}
    })

  },
  // 分享
  onShareAppMessage: function (res) {
    var that = this
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: '牛逼死了',
      path: 'src/home/home?id=hahah',
      success: function(res) {
        // 转发成功
        wx.getShareInfo({
          shareTicket: res.shareTickets[0],
          success: function(res){
            that.getGroupsInfo(res.encryptedData, res.iv)
          }
        })
      },
      fail: function(res) {
        // 转发失败
      }
    }
  },
  // 解析信息
  uploadGroupInfo: function (encryptedData, iv) {
    var that = this
    wx.request({
      url: config.host + '/v1/user_share_groups/upload_group_info',
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
        that.getGroupsInfo(res.data.open_gid)
      }
    })
  },
  // 获取排行榜人员信息
  getGroupsInfo: function (openGid) {
    var that = this
    wx.request({
      url: config.host + '/v1/user_share_groups/top',
      method: 'GET',
      data: {
        'open_gid': 'G7YYY42LEWDz-4JNnSCwvJ621dP0'//openGid
      },
      header: {
        'Authorization': that.data.access_token,
        'Content-Type': 'application/json'
      },
      success: function (res) {
        that.setData({
          rankingsList: res.data.users
        })
      },
      fail: function(res) {

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
        if (res.data.user_share_groups.length > 0) {
          that.setData({
            rankings: false
          })
          // 这里调用加载群用户信息
          // that.xxxxx(res.data.user_share_groups[res.data.user_share_groups.length - 1])
        }
        that.setData({
          userShareGroupsList: res.data.user_share_groups
        })
      }
    })
  },
  toTesting: function () {
    wx.navigateTo({
      url:'/src/testing/testing'
    })
  },
  toBankList: function () {
    wx.navigateTo({
      url:'/src/bankList/bankList'
    })
  },
  group: function () {
    wx.navigateTo({
      url:'/src/shareGroups/shareGroups'
    })
  }
})
