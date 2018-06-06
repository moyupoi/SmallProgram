import config from '../../config'
const app = getApp()

Page({
  data: {
    isFetching: true,
    bankName: '',
    imagePath: '',
    bankArray: [],
    themeArray: [],
    bankArrayIndex: 0,
    themeArrayIndex: 0,
    parPage: 10,
    page: 1,
    bankCards: [],
    hasMoreData: true,
    access_token: ''
  },
  onLoad: function (options) {
    const that = this
    const access_token = wx.getStorageSync('access_token') || ''
    if (options.id) {
      this.setData({
        themeArrayIndex: options.id
      })
    }
    if (access_token != '') {
      that.setData({
        access_token: access_token,
        rankings: true
      })
      that.loadInit(that.data.parPage, that.data.page, '', that.data.themeArrayIndex)
    } else {
      resetLogin(that)
    }
  },
  loadInit: function (per_page, page, bank_id, theme) {
    var that = this
    var themes = parseInt(theme) ? theme : ''
    wx.request({
      url: config.host + '/v1/bank_cards',
      method: 'GET',
      header: {
        'Authorization': that.data.access_token,
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
            bankCards: bankCards,
            isFetching: false
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
  },
  cardItem: function (e) {
    // wx.showActionSheet({
    //   itemList: ['卡片地址复制到剪切板'],
    //   success: function(res) {
    //     if (res.tapIndex == 0) {
    //       wx.setClipboardData({
    //         data: e.currentTarget.dataset.url,
    //         success: function(res) {
    //           wx.getClipboardData ({
    //             success: function(res) {
    //               wx.showToast({
    //                 title: "复制专属链接在浏览器打开",
    //               })
    //             }
    //           })
    //         }
    //       })
    //     }
    //   },
    //   fail: function(res) {}
    // })
    if (e.currentTarget.dataset.id) {
      wx.navigateTo({
        url:'/src/throughputRate/throughputRate?cardid=' + e.currentTarget.dataset.id
      })
    }
  }
})
