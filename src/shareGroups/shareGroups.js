import config from '../../config'
const app = getApp()

Page({
  data: {
    userShareGroupsList: [],
    access_token: '',
    rankingsList: []
  },
  onLoad: function (options) {
    const that = this
    const access_token = wx.getStorageSync('access_token') || ''
    if (access_token != '') {
      that.setData({
        access_token: access_token
      })
      that.loginUserShareGroups()
    }
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
        console.log(res.data)
        that.setData({
          userShareGroupsList: res.data.user_share_groups
        })
      }
    })
  },
  userGroup: function (e) {
    if (e && e.currentTarget && e.currentTarget.dataset && e.currentTarget.dataset.open_gid) {
      this.getGroupsInfo(e.currentTarget.dataset.open_gid)
    }
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
        if (res.statusCode == '401') {
          resetLogin(that)
        }
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
      },
      fail: function(res) {
      }
    })
  }
})
