import config from '../../config'
const app = getApp()

Page({
  data: {
    items: [
      { name: '0', value: '从来不败家', checked: 'true' },
      { name: '1', value: '败家' },
      { name: '2', value: '败你妹家' },
      { name: '3', value: '反正败家就对了！' }
    ],
    selected: '0',
    page: ''
  },
  onLoad: function (options) {
    var that = this
    if (options.page != undefined) {
      // console.log(options.page)
      this.setData({
        page: options.page + options.key
      })
    }
    if (options.key != undefined) {
      switch (options.key) {
        case '0':
          that.setData({
            items: [
              { name: '0', value: '从来不败家1', checked: 'true' },
              { name: '1', value: '败家1' },
              { name: '2', value: '败你妹家1' },
              { name: '3', value: '反正败家就对了1！' }
            ]
          })
          break
        case '1':
          that.setData({
            items: [
              { name: '0', value: '从来不败家2', checked: 'true' },
              { name: '1', value: '败家2' },
              { name: '2', value: '败你妹家2' },
              { name: '3', value: '反正败家就对了2！' }
            ]
          })
          break
        case '2':
          that.setData({
            items: [
              { name: '0', value: '从来不败家3', checked: 'true' },
              { name: '1', value: '败家3' },
              { name: '2', value: '败你妹家3' },
              { name: '3', value: '反正败家就对了3！' }
            ]
          })
          break
        case '3':
          that.setData({
            items: [
              { name: '0', value: '从来不败家4', checked: 'true' },
              { name: '1', value: '败家4' },
              { name: '2', value: '败你妹家4' },
              { name: '3', value: '反正败家就对了4！' }
            ]
          })
          break
        default:
      }
    }

  },
  radioChange: function (e) {
    // console.log(e.detail.value)
    this.setData({
      selected: e.detail.value
    })
  },
  next: function (e) {
    if (this.data.page.length == 4) {
      wx.reLaunch({
        url: '/src/screenshot/screenshot?page=' + this.data.page + this.data.selected
      })
      return
    }
    wx.navigateTo({
      url: '/src/testing/testing?key=' + this.data.selected + "&page=" + this.data.page
    })

    // this.setData({
    //   items: [
    //     { name: '0', value: '什么值得买', checked: 'true' },
    //     { name: '1', value: '什么都不值得买' },
    //     { name: '2', value: '反正买就对了' },
    //     { name: '3', value: '买买买！' }
    //   ]
    // })
  }
})
