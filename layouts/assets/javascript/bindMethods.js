import config from '../../../config'

// 重新登录方法
export function resetLogin (th) {
  const that = this
  wx.login({
    success: res => {
      if (res.code) {
        wx.request({
          url: config.host + '/v1/users/wechat_login',
          method: 'POST',
          data: {
            code: res.code
          }, success: function (res) {
            wx.setStorage({
              key: "access_token",
              data: res.data.access_token
            })
            th.onLoad()

          }
        })
      }
    }
  })
}
