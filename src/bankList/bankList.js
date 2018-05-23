import config from '../../config'
const app = getApp()

Page({
  data: {
    isFetching: true,
    bankListText: '新手推荐',
    themeCardText: '主题办卡',
    themeCard: [],
    themeCardIndex: 0,
    autoplay: false,
    indicatorDots: true,
    access_token: ''
  },
  onLoad: function(options) {
    const that = this
    const access_token = wx.getStorageSync('access_token') || ''
    if (access_token != '') {
      that.setData({
        access_token: access_token,
        rankings: true
      })
      that.loadInit()
    }
  },
  loadInit: function () {
    var that = this
    wx.request({
      url: config.host + '/v1/bank_cards/apply_card_index',
      method: 'GET',
      header: {
        'Authorization': that.data.access_token,
        'Content-Type': 'application/json'
      },
      success: function (res) {
        that.setData({
          movies: res.data.bank_cards,
          themeCard: res.data.bank_card_themes,
          isFetching: false
        })
      }
    })
  },
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  bindText: function() {
  },
  bindSkip: function() {
  },
  cardItem: function (e) {
    wx.showActionSheet({
      itemList: ['卡片地址复制到剪切板'],
      success: function(res) {
        if (res.tapIndex == 0) {
          wx.setClipboardData({
            data: e.currentTarget.dataset.url,
            success: function(res) {
              wx.getClipboardData ({
                success: function(res) {
                  wx.showToast({
                    title: "复制专属链接在浏览器打开",
                  })
                }
              })
            }
          })
        }
      },
      fail: function(res) {}
    })
  }
})
