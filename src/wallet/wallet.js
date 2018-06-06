import config from '../../config'
import { resetLogin } from '../../layouts/assets/javascript/bindMethods.js'

Page({
  data: {
    access_token: '',
    userid: '',
    userWallet: {},
    userWalletBills: [],
    isFrequency: false,
    isPhone: false,
    page: 1
  },
  onLoad: function (options) {
  },
  onShow: function () {
    const that = this
    const access_token = wx.getStorageSync('access_token') || ''
    const userid = wx.getStorageSync('userid') || ''
    if (access_token != '' && userid != '') {
      that.setData({
        access_token: access_token,
        userid: userid
      })
      that.walletInit()
    } else {
      resetLogin(that)
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
        that.setData({
          userWallet: res.data.user_wallet,
          userWalletBills: res.data.user_wallet_bills,
          isFrequency: res.data.user_wallet.balance_amount > 0 ? true : false
        })
      },
      fail: function(res) {}
    })
  },
  cashIn: function (e) {
    const that = this
    // 获取权限 更新用户手机号
    if (e.detail.errMsg == "getPhoneNumber:ok") {
      wx.request({
        url: config.host + '/v1/users/update_mobile',
        method: 'POST',
        data: JSON.stringify({
          'encryptedData': e.detail.encryptedData,
          'iv': e.detail.iv
        }),
        header: {
          'Authorization': that.data.access_token,
          'Content-Type': 'application/json'
        },
        success: function (res) {},
        fail: function(res) {}
      })
    }
    if (this.data.userWallet.balance_amount > 0) {
      wx.navigateTo({
        url:'/src/userWallet/userWallet?balanceAmount=' + this.data.userWallet.balance_amount
      })
    }
  },
  // 分页
  onReachBottom: function () {
    wx.showToast({
      title: "正在加载更多",
    })
    this.loadMore(this.data.page + 1)
  },
  loadMore: function (page) {
    const that = this
    wx.request({
      url: config.host + '/v1/user_wallets/bills',
      method: 'GET',
      data: {
        'page': page
      },
      header: {
        'Authorization': that.data.access_token,
        'Content-Type': 'application/json'
      },
      success: function (res) {
        that.setData({
          userWalletBills: that.data.userWalletBills.concat(res.data),
          page: that.data.page + 1
        })
      },
      fail: function(res) {}
    })
  }
})
