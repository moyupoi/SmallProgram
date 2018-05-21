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
    indicatorDots: true
  },
  onLoad: function(options) {
    var that = this
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
                that.loadInit()
              }
            }
          })
        } else {}
      },
      fail: res => {}
    })
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
