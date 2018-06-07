import config from '../../config'
import { resetLogin } from '../../layouts/assets/javascript/bindMethods.js'

Page({
  data: {
    access_token: '',
    userid: '',
    balanceAmount: 0,
    codeImg: '',
    inputMoney: 0,
    inputCode: '',
    messageCodeIndex: 0,
    codeVal: '',
    focus: false,
    state: 'initial' //initial code success
  },
  onLoad: function (options) {
    const that = this
    const access_token = wx.getStorageSync('access_token') || ''
    const userid = wx.getStorageSync('userid') || ''
    if (access_token != '' && userid != '') {
      that.setData({
        access_token: access_token,
        userid: userid,
        codeImg: config.host + '/v1/user_wallets/captcha?user_id=' + userid + '&time=' + Date.parse(new Date()),
        balanceAmount: options.balanceAmount
      })
      that.walletInit()
    }
  },
  walletInit: function () {
    const that = this
    wx.request({
      url: config.host + '/v1/user_wallets/',
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
      },
      fail: function(res) {}
    })
  },
  codeBtn: function () {
    this.setData({
      codeImg: config.host + '/v1/user_wallets/captcha?user_id=' + this.data.userid + '&time=' + Date.parse(new Date())
    })
  },
  closeBtn: function () {
    this.setData({
      inputMoney: ''
    })
  },
  allMoney: function () {
    this.setData({
      inputMoney: this.data.balanceAmount
    })
  },
  inputMoney: function (event) {
    this.setData({
      inputMoney: event.detail.value
    })
  },
  inputCode: function (event) {
    this.setData({
      inputCode: event.detail.value
    })
  },
  // 点击提现 获取短信
  withdrawMoney: function () {
    const that = this
    let imgAuth = this.data.inputCode
    if (that.data.inputMoney == '' || that.data.inputMoney < 0) {
      wx.showToast({
        title: '请正确输入提取金额',
        icon: "none"
      })
    } else if (imgAuth.length < 4) {
      wx.showToast({
        title: '请输入正确图形码',
        icon: "none"
      })
    } else {
      wx.request({
        url: config.host + '/v1/user_wallets/send_sms',
        method: 'POST',
        data: JSON.stringify({
          img_auth_code: imgAuth
        }),
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
          } else {
            wx.showToast({
              title: res.data.message,
              icon: "none"
            })
            that.setData({
              focus: true,
              state: 'code'
            })
          }
        }
      })
    }
  },
  // 点击输入短信区域获取焦点
  labMassageCode: function () {
    this.setData({
      focus: true
    })
  },
  // 输入验证码提现
  codeInput: function (event) {
    const that = this
    that.setData({
      codeVal: event.detail.value
    })
    if (that.data.codeVal.length > 3) {
      wx.request({
        url: config.host + '/v1/user_wallets/withdraw',
        method: 'POST',
        data: JSON.stringify({
          amount: that.data.inputMoney,
          auth_code: that.data.codeVal
        }),
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
          } else if (res.statusCode == '200') {
            that.setData({
              state: 'success'
            })
          }
        }
      })
    }
  },
  // 提取成功 后退1页
  completeBtn: function () {
    wx.navigateBack({
      delta: 1
    })
  }
})
