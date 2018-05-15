import config from '../../config'
const app = getApp()

Page({
  data: {
    bankListText: '新手推荐',
    themeCardText: '主题办卡',
    themeCard: [],
    themeCardIndex: 0,
    autoplay: false,
    indicatorDots: true
  },
  onLoad: function(options) {
    this.setData({
      title: options.title
    })
    var that = this
    if (app.employIdCallback) {
      that.loadInit()
    } else {
      app.employIdCallback = employId => {
        if (employId != '') {
          that.loadInit()
        }
      }
    }
  },
  loadInit: function () {
    var that = this
    wx.request({
      url: config.host + '/v1/bank_cards/apply_card_index',
      method: 'GET',
      header: {
        'Authorization': app.globalData.access_token,
        'Content-Type': 'application/json'
      },
      success: function (res) {
        that.setData({
          movies: res.data.bank_cards,
          themeCard: res.data.bank_card_themes
        })
        console.log(res.data)
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
  }
})
