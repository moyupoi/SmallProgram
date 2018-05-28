import config from '../../config'
const app = getApp()

Page({
  data: {
    access_token: '',
    bankCardId: '',
    inviteData: '',
    pass_rate: 0,
    increase_pass_rate: 0,
  },
  onLoad: function (options) {
    const that = this
    const access_token = wx.getStorageSync('access_token') || ''
    if (access_token != '') {
      that.setData({
        access_token: access_token,
        bankCardId: options.cardid
      })
      that.inviteInit()
    }
  },
  inviteInit: function () {
    const that = this
    wx.request({
      url: config.host + '/v1/user_invite_records/invite_init',
      method: 'GET',
      data: {
        'bank_card_id': that.data.bankCardId
      },
      header: {
        'Authorization': that.data.access_token,
        'Content-Type': 'application/json'
      },
      success: function (res) {
        that.setData({
          inviteData: res.data,
          pass_rate: parseInt(res.data.pass_rate * 100),
          increase_pass_rate: parseInt(res.data.increase_pass_rate * 100)
        })
      },
      fail: function(res) {

      }
    })
  },
  friendsHelp: function () {

  },
  applyCard: function () {
    const that = this
    wx.showModal({
      title: '提示',
      content: '邀请好友助力',
      cancelText: '直接申请',
      confirmText: '邀请助力',
      success: function(res) {
        if (res.confirm) {
          // 邀请助力 弹出分享
        } else if (res.cancel) {
          wx.setClipboardData({
            data: that.data.inviteData.apply_url,
            success: function(res) {
              wx.getClipboardData ({
                success: function(res) {
                  wx.showModal({
                    title: '提示',
                    content: '您已成功复制专属链接，请到浏览器地址栏粘贴打开，即可申请',
                    showCancel: false,
                    success: function(res) {}
                  })
                }
              })
            }
          })
        }
      }
    })
  },
  // 分享
  onShareAppMessage: function (res) {
    var that = this
    if (res.from === 'button') {
      // 来自页面内转发按钮
      // console.log(res.target)
    }
    return {
      title: '邀请助力',
      path: 'src/friendsHelp/friendsHelp?shareid=' + that.data.inviteData.id,
      imageUrl: '',
      success: function(tic) {
        // 转发成功
        // wx.getShareInfo({
        //   shareTicket: tic.shareTickets[0],
        //   success: function(encData) {
        //   }
        // })
      },
      fail: function(tic) {
        // 转发失败
      }
    }
  }
})
