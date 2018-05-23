import config from '../../config'
const app = getApp()

Page({
  data: {
    access_token: ''
  },
  onLoad: function (options) {
    const that = this
    const access_token = wx.getStorageSync('access_token') || ''
    if (access_token != '') {
      that.setData({
        access_token: access_token
      })
    }
  },
  friendsHelp: function () {

  },
  applyCard: function () {
    wx.showModal({
      title: '提示',
      content: '邀请好友助力',
      cancelText: '直接申请',
      confirmText: '邀请助力',
      success: function(res) {
        if (res.confirm) {
          console.log('邀请助力')
        } else if (res.cancel) {
          console.log('直接申请')
        }
      }
    })
  }
})
