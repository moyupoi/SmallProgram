import config from '../../config'
const app = getApp()

Page({
  data: {
    bankName: '',
    imagePath: ''
  },
  onLoad: function (options) {
    this.setData({
      bankName: options.title
    })
  }
})
