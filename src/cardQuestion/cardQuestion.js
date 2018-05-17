import config from '../../config'
const app = getApp()

Page({
  data: {
    question: true,
    selectCardIndex: 0,
    selectCardTest: [],
    results: [],
    bestRecommends: [],
    otherRecommends: []
  },
  onLoad: function(options) {
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
      url: config.host + '/v1/questions',
      method: 'GET',
      header: {
        'Authorization': app.globalData.access_token,
        'Content-Type': 'application/json'
      },
      data: {
        category: 'select_card_test'
      },
      success: function (res) {
        let selectCardTest = []
        res.data.map((item, i) => {
          var data = {}
          data.category = item.category
          data.title = item.title
          var dataArr = []
          item.items.map((arr, i) => {
            dataArr.push({ checked: false, name: arr, index: i })
          })
          data.items = dataArr
          selectCardTest.push(data)
        })
        that.setData({
          selectCardTest: selectCardTest
        })
      }
    })
  },
  checkChange: function (e) {
    var selectUpdata = this.data.selectCardTest
    for (var i = 0; i < selectUpdata[this.data.selectCardIndex].items.length; i++) {
      let item = selectUpdata[this.data.selectCardIndex].items[i]
      if (e.currentTarget.dataset.category == 'multiple' && e.currentTarget.dataset.index == item.index) {
        item.checked ? item.checked = false : item.checked = true
      } else if (e.currentTarget.dataset.category == 'single') {
        item.checked = false
        if (e.currentTarget.dataset.index == item.index) {
          item.checked = true
        }
      }
    }
    this.setData({
      selectCardTest: selectUpdata
    })
  },
  bindPrevious: function () {
    if (this.data.selectCardIndex > 0) {
      this.setData({
        selectCardIndex: this.data.selectCardIndex - 1
      })
    }
  },
  bindNext: function () {
    var isTrue = false
    var that = this
    var selectUpdata = ''
    if (that.data.selectCardTest != '') {
      selectUpdata = that.data.selectCardTest
      for (var i = 0; i < selectUpdata[that.data.selectCardIndex].items.length; i++) {
        if (selectUpdata[that.data.selectCardIndex].items[i].checked == true) {
          isTrue = true
        }
      }
    }
    if (that.data.selectCardIndex == 3 && that.data.selectCardTest != '' && isTrue) {
      var resultArr = []
      var sct = that.data.selectCardTest
      for (var i = 0; i < sct.length; i++) {
        let ra = []
        for (var x = 0; x < sct[i].items.length; x++) {
          if (sct[i].items[x].checked) {
            ra.push(sct[i].items[x].name)
          }
        }
        resultArr.push(ra)
      }
      var that = that
      wx.request({
        url: config.host + '/v1/questions/test_result',
        method: 'POST',
        header: {
          'Authorization': app.globalData.access_token,
          'Content-Type': 'application/json'
        },
        data: JSON.stringify({
          category: 'select_card_test',
          results: resultArr
        }),
        success: function (res) {
          if (res.data.message == "提交成功") {
            that.initRecommend()
          }
        }
      })
    } else if (that.data.selectCardIndex < 3 && isTrue) {
      that.setData({
        selectCardIndex: that.data.selectCardIndex + 1
      })
    } else if (that.data.selectCardIndex < 3 && !isTrue) {
      wx.showModal({
        title: '请选择',
        showCancel: false,
        content: '至少选中其中一项'
      })
    }
  },
  initRecommend: function () {
    var that = this
    wx.request({
      url: config.host + '/v1/bank_cards/recommend',
      method: 'GET',
      header: {
        'Authorization': app.globalData.access_token,
        'Content-Type': 'application/json'
      },
      success: function (res) {
        that.setData({
          bestRecommends: res.data.best_recommends,
          otherRecommends: res.data.other_recommends,
          question: !that.data.question
        })
      }
    })
  },
  returnBtn: function () {
    wx.navigateBack({
      delta: 1
    })
  },
  resetBtn: function () {
    this.setData({
      question: true,
      selectCardIndex: 0,
      selectCardTest: [],
      results: [],
      bestRecommends: [],
      otherRecommends: []
    })
    this.loadInit()
  }
})
