import config from '../../config'
import { resetLogin, access_token } from '../../layouts/assets/javascript/bindMethods.js'

Page({
  data: {
    access_token: '',
    shareid: '',
    helpInit: [],
    page: 1
  },
  onLoad: function (options) {
    const that = this
    const access_token = wx.getStorageSync('access_token') || ''
    if (access_token != '' && options.shareid) {
      that.setData({
        access_token: access_token,
        shareid: options.shareid
      })
      that.helpInit()
    }
  },
  helpInit: function () {
    const that = this
    wx.request({
      url: config.host + '/v1/user_invite_records/' + that.data.shareid + '/help_records',
      method: 'GET',
      data: {
        page: that.data.page,
        per_page: 20
      },
      header: {
        'Authorization': that.data.access_token,
        'Content-Type': 'application/json'
      },
      success: function (res) {
        let bankCards = res.data
        console.log(res.data)
        if (res.statusCode == '401') {
          resetLogin
        }
        if (that.data.page > 1) {
          bankCards = that.data.concat(bankCards)
          that.setData({
            helpInit: bankCards,
            page: that.data.page + 1
          })
          // console.log(res.data)
        } else {
          that.setData({
            helpInit: bankCards
          })
          // console.log(res.data)
        }
      },
      fail: function(res) {
      }
    })
  },
  onReachBottom: function () {
    wx.showToast({
      title: "正在加载更多",
    })
    this.helpInit()
  }
})
