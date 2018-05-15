import config from '../../config'
const app = getApp()

Page({
  data: {
    bankName: '',
    imagePath: '',
    bankArray: [],
    foodArray: [],
    bankArrayIndex: 0,
    foodArrayIndex: 0,
    parPage: 10,
    page: 1,
    bankCards: [],
    hasMoreData: true
  },
  onLoad: function (options) {
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
      url: config.host + '/v1/bank_cards',
      method: 'GET',
      header: {
        'Authorization': app.globalData.access_token,
        'Content-Type': 'application/json'
      },
      data: {
        'per_page': this.data.parPage,
        'page': this.data.page
      },
      success: function (res) {
        console.log(res.data.bank_cards[0])
        that.setData({
          bankArray: res.data.banks,
          foodArray: res.data.bank_card_themes,
          bankCards: res.data.bank_cards
        })
      }
    })
  },
  selectedBank: function (event) {
    this.setData({
      bankArrayIndex: event.detail.value
    })
  },
  selectedFood: function (event) {
    this.setData({
      foodArrayIndex: event.detail.value
    })
  },
  onReachBottom: function () {
    wx.showToast({
      title: "正在刷新数据"
    })
  }
})
