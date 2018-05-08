import config from '../../config'
const app = getApp()

Page({
  data: {
    bankName: ''
  },
  onLoad: function (options) {
    this.setData({
      bankName: options.title
    })
    // getCurrentPages()
  },
  bindViewTap: function() {
    // wx.navigateTo({
    //   url: '../logs/logs'
    // })
  },
  bindText: function() {
  },
  bindSkip: function() {
  }
})
