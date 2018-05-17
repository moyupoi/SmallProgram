import config from '../../config'
const app = getApp()

Page({
  data: {
    bankName: '',
    imagePath: '',
    bankArray: [],
    themeArray: [],
    bankArrayIndex: 0,
    themeArrayIndex: 0,
    parPage: 10,
    page: 1,
    bankCards: [],
    hasMoreData: true
  },
  onLoad: function (options) {
    if (options.id) {
      this.setData({
        themeArrayIndex: options.id
      })
    }
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
                that.loadInit(that.data.parPage, that.data.page, '', that.data.themeArrayIndex)
              }
            }
          })
        } else {}
      },
      fail: res => {}
    })
  },
  loadInit: function (per_page, page, bank_id, theme) {
    var that = this
    var themes = parseInt(theme) ? theme : ''
    wx.request({
      url: config.host + '/v1/bank_cards',
      method: 'GET',
      header: {
        'Authorization': app.globalData.access_token,
        'Content-Type': 'application/json'
      },
      data: {
        'per_page': per_page,
        'page': page,
        'bank_id': bank_id,
        'theme': themes
      },
      success: function (res) {
        var bankCards = res.data.bank_cards
        // console.log(page)
        // debugger
        if (page > 1) {
          bankCards = that.data.bankCards.concat(bankCards)
          that.setData({
            bankCards: bankCards,
            page: that.data.page + 1
          })
        } else {
          that.setData({
            bankArray: res.data.banks,
            themeArray: res.data.bank_card_themes,
            bankCards: bankCards
          })
        }
      }
    })
  },
  selectedTheme: function (event) {
    this.setData({
      themeArrayIndex: event.detail.value,
      page: 1
    })
    this.loadInit(this.data.parPage, 1, this.data.bankArray[this.data.bankArrayIndex].id, this.data.themeArray[event.detail.value].id)
  },
  selectedBank: function (event) {
    this.setData({
      bankArrayIndex: event.detail.value,
      page: 1
    })
    this.loadInit(this.data.parPage, 1, this.data.bankArray[event.detail.value].id, this.data.themeArray[this.data.themeArrayIndex].id)
  },
  onReachBottom: function () {
    wx.showToast({
      title: "正在加载更多",
    })
    var themen = this.data.themeArrayIndex ? this.data.themeArrayIndex : ''
    this.loadInit(this.data.parPage, this.data.page + 1, this.data.bankArray[this.data.bankArrayIndex].id, themen)
  }
})
