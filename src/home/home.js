import config from '../../config'
const app = getApp()

Page({
  data: {
    isFetching: true,
    isAccess_token: true,
    portraitPath: '',
    rankingsList: [],
    userShareGroupsList: [],
    access_token: '',
    isDefault: true,
    isRankings: true,
    isGroupsInit: true,
    isTesting: true,
    isGroup: true,
    isViewDrawing: true,
    isGroupPK: true

  },
  onLoad: function (options) {
    var that = this

    // 埋点
    wx.reportAnalytics('page_view', {
      page_view_name: '首页'
    })
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
                access_token: res.data.access_token,
                isFetching: false
              })
              if (res.data.access_token != '') {
                if (options.open_gid) {
                  that.getGroupsInfo(options.open_gid)
                // 通过群内转发进入的用户
                } else if (app.globalData.shareEncryptedData && app.globalData.shareIv) {
                  that.uploadGroupInfo(app.globalData.shareEncryptedData, app.globalData.shareIv)
                } else {
                  // 获取群列表 如果当前用户超过1个说明分享过群
                  that.loginUserShareGroups()
                }
              }
            }
          })
        } else {}
      },
      fail: res => {}
    })
    wx.showShareMenu({
      withShareTicket: true
    })

  },
  // 分享
  onShareAppMessage: function (res) {
    var that = this
    if (res.from === 'button') {
      // 来自页面内转发按钮
      // console.log(res.target)
    }
    return {
      title: '魔卡多',
      path: 'src/home/home',
      success: function(tic) {
        // 转发成功
        wx.getShareInfo({
          shareTicket: tic.shareTickets[0],
          success: function(encData) {
            that.uploadGroupInfo(encData.encryptedData, encData.iv)
          }
        })
      },
      fail: function(tic) {
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
        'open_gid': openGid
      },
      header: {
        'Authorization': that.data.access_token,
        'Content-Type': 'application/json'
      },
      success: function (res) {
        that.setData({
          isDefault: res.data.is_has_test,
          isRankings: false,
          isViewDrawing: !res.data.is_has_test,
          isTesting: res.data.is_has_test,
          rankingsList: res.data.users,
          isGroup: false,
          isGroupsInit: true
          // isRankings: res.data.is_has_test
        })
        // console.log(res)
      },
      fail: function(res) {

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
  },
  // 搜索进入程序 判断用户分享过哪些群
  loginUserShareGroups: function () {
    var that = this
    wx.request({
      url: config.host + '/v1/user_share_groups',
      method: 'GET',
      header: {
        'Authorization': that.data.access_token,
        'Content-Type': 'application/json'
      },
      success: function (res) {
        if (res.data.user_share_groups && res.data.user_share_groups.length > 0) {
          that.setData({
            userShareGroupsList: res.data.user_share_groups
          })
        }
        // 如果参加过测试
        that.setData({
          isDefault: res.data.is_has_test,
          isViewDrawing: !res.data.is_has_test,
          isTesting: res.data.is_has_test,
          isGroupPK: !res.data.is_has_test,
          isGroupsInit: false
        })
      }
    })
  },
  viewDrawing: function () {
    wx.navigateTo({
      url:'/src/testing/testing?viewDrawing=true'
    })
  }
})
