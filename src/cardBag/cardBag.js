import config from '../../config'
import { resetLogin } from '../../layouts/assets/javascript/bindMethods.js'


Page({
  data: {
    access_token: '',
    formId: '',
    isCardBag: false,
    cardBagList: [],
    cardNumber: '',
    pickerBanks: [],
    pickerBanksIndex: 0,
    bankId: '',
    repaymentDate: [],
    repaymentDateIndex: 0,
    statementDate: [],
    statementDateIndex: 0,
    closeHelp: true,
    isInsert: false,
    updataBankId: '',
    isFetching: false,
    isHome: true
  },
  onLoad: function (options) {
    const that = this
    const access_token = wx.getStorageSync('access_token') || ''
    if (access_token != '') {
      let arr = []
      for (let i = 1; i <= 30; i++) {
        var data = {
          index: i,
          name: i + '日'
        }
        arr.push(data)
      }
      that.setData({
        access_token: access_token,
        repaymentDate: arr,
        statementDate: arr
      })
      that.cardBagList()
      // 判断是从信用卡还款日通知中跳入到cardBag页面时没有返回按钮
      if (options.source == 'notice') {
        that.setData({
          isHome: false
        })
      }
    }
  },
  cardBagList: function () {
    const that = this
    wx.request({
      url: config.host + '/v1/user_credit_cards/',
      method: 'GET',
      header: {
        'Authorization': that.data.access_token,
        'Content-Type': 'application/json'
      },
      success: function (res) {
        if (res.statusCode == '401') {
          resetLogin(that)
          return
        }
        for (let i = 0; i < res.data.length; i++) {
          res.data[i].frontNumber = res.data[i].card_number.substr(0, 4)
          res.data[i].afterNumber = res.data[i].card_number.substr(res.data[i].card_number.length - 4, res.data[i].card_number.length)
        }
        that.setData({
          cardBagList: res.data,
          isFetching: false
        })
      }
    })
    wx.request({
      url: config.host + '/v1/user_credit_cards/new',
      method: 'GET',
      header: {
        'Authorization': that.data.access_token,
        'Content-Type': 'application/json'
      },
      success: function (res) {
        if (res.statusCode == '401') {
          resetLogin(that)
          return
        }
        that.setData({
          pickerBanks: res.data.banks,
          bankId: res.data.banks[0].id
        })
      }
    })
  },
  formSubmit: function (event) {
    // console.log(event.detail.formId)
    // formId 只有在真机上才会有效
    this.setData({
      formId: event.detail.formId,
      isCardBag: !this.data.isCardBag
    })
  },
  addCareBtn: function () {
    this.setData({
      isInsert: false,
      cardNumber: '',
      pickerBanksIndex: 0,
      repaymentDateIndex: 0,
      statementDateIndex: 0,
    })
  },
  bindPickerChange: function (event) {
    this.setData({
      pickerBanksIndex: event.detail.value,
      bankId: this.data.pickerBanks[event.detail.value].id
    })
  },
  bindRepaymentDateChange: function (event) {
    this.setData({
      repaymentDateIndex: event.detail.value
    })
  },
  bindStatementDateChange: function (event) {
    this.setData({
      statementDateIndex: event.detail.value
    })
  },
  cardNumber: function (event) {
    this.setData({
      cardNumber: event.detail.value
    })
  },
  cancel: function () {
    this.setData({
      isCardBag: false
    })
  },
  insertCardData: function (event) {
    const that = this
    that.setData({
      isFetching: true
    })
    if (that.data.cardNumber == '') {
      wx.showToast({
        title: "请输入卡号",
        icon: "none"
      })
      return
    }
    wx.request({
      url: config.host + '/v1/user_credit_cards/',
      method: 'POST',
      header: {
        'Authorization': that.data.access_token,
        'Content-Type': 'application/json',
        'X-JINKU-WECHAT-FORM-ID': that.data.formId
      },
      data: JSON.stringify({
        "card_number": that.data.cardNumber,
        "due_date": parseInt(that.data.repaymentDateIndex) + 1,
        "bill_date": parseInt(that.data.statementDateIndex) + 1,
        "bank_id": that.data.bankId
      }),
      success: function (res) {
        that.setData({
          isFetching: false
        })
        if (res.statusCode == '401') {
          resetLogin(that)
          return
        } else if (res.statusCode == '422') {
          wx.showToast({
            title: res.data.message,
            icon: "none"
          })
          return
        }
        that.setData({
          isCardBag: false
        })
        that.cardBagList()
      }
    })
  },
  updateCardInfo: function (event) {
    const that = this
    wx.request({
      url: config.host + '/v1/user_credit_cards/' + event.target.dataset.id + '/edit',
      method: 'GET',
      header: {
        'Authorization': that.data.access_token,
        'Content-Type': 'application/json'
      },
      success: function (res) {
        if (res.statusCode == '401') {
          resetLogin(that)
          return
        } else if (res.statusCode == '422') {
          wx.showToast({
            title: res.data.message,
            icon: "none"
          })
          return
        }
        let bankIdIndex = ''
        let resBankId = res.data.user_credit_card.bank_id
        res.data.banks.map((item, i) => {
          if (item.id == resBankId) {
            bankIdIndex = i
          }
        })
        that.setData({
          isCardBag: true,
          isInsert: true,
          cardNumber: res.data.user_credit_card.card_number,
          bankId: res.data.user_credit_card.bank_id,
          pickerBanksIndex: bankIdIndex,
          repaymentDateIndex: res.data.user_credit_card.bill_date - 1,
          statementDateIndex: res.data.user_credit_card.due_date - 1,
          updataBankId: res.data.user_credit_card.id
        })
      }
    })
  },
  updataCardData: function () {
    const that = this
    if (that.data.cardNumber == '') {
      wx.showToast({
        title: "请输入卡号",
        icon: "none"
      })
      return
    }
    that.setData({
      isFetching: true
    })
    wx.request({
      url: config.host + '/v1/user_credit_cards/' + that.data.updataBankId,
      method: 'PUT',
      header: {
        'Authorization': that.data.access_token,
        'Content-Type': 'application/json'
      },
      data: JSON.stringify({
        card_number: that.data.cardNumber,
        due_date: parseInt(that.data.repaymentDateIndex) + 1,
        bill_date: parseInt(that.data.statementDateIndex) + 1,
        bank_id: that.data.bankId,
        id: that.data.updataBankId
      }),
      success: function (res) {
        that.setData({
          isFetching: true
        })
        if (res.statusCode == '401') {
          resetLogin(that)
          return
        } else if (res.statusCode == '422') {
          wx.showToast({
            title: res.data.message,
            icon: "none"
          })
          return
        }
        that.setData({
          isCardBag: false
        })
        that.cardBagList()
      }
    })
  },
  openHelp: function () {
    this.setData({
      closeHelp: false
    })
  },
  closeHelp: function () {
    this.setData({
      closeHelp: true
    })
  },
  returnHome: function () {
    wx.switchTab({
      url:'/src/personalCenter/personalCenter'
    })
  }
})
