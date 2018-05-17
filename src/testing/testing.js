import config from '../../config'
const app = getApp()

Page({
  data: {
    isUserInfo: true,
    creditAmountTest: [],
    creditAmountIndex: 0,
    page: '',
    question: true,
    imagePath: "",
    maskHidden: true,
    // avatarUrl: "./images/tx.png",
    copywriting: "看到了你的爱马仕@_@也看到了你美丽的人生",
    // copywriting: "看到了你的爱马仕",
    userName: '墨鱼卷',
    answersData: '',
    position: "1.1"
  },
  onLoad: function (options) {
    var that = this
    wx.login({
      success: res => {
        if (res.code) {
          wx.request({
            url: config.host + '/v1/users/wechat_login',
            method: 'POST',
            data: {
              code: res.code
            }, success: function (res) {
              that.setData({
                access_token: res.data.access_token
              })
              if (res.data.access_token != '') {
                that.setData({
                  rankings: true
                })
                that.loadInit()
                // that.answers()
              }
            }
          })
        } else {}
      },
      fail: res => {}
    })
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
        category: 'credit_amount_test'
      },
      success: function (res) {
        let creditAmountTest = []
        if (res.data.map != undefined) {
          res.data.map((item, i) => {
            var data = {}
            data.category = item.category
            data.title = item.title
            var dataArr = []
            item.items.map((arr, i) => {
              dataArr.push({ checked: false, name: arr, index: i })
            })
            data.items = dataArr
            creditAmountTest.push(data)
          })
          that.setData({
            creditAmountTest: creditAmountTest
          })
        } else {
          wx.navigateBack({
            delta: 1
          })
        }
      }
    })
  },
  selectTap: function (e) {
    var selectUpdata = this.data.creditAmountTest
    for (var i = 0; i < selectUpdata[this.data.creditAmountIndex].items.length; i++) {
      let item = selectUpdata[this.data.creditAmountIndex].items[i]
      if (e.currentTarget.dataset.index == item.index) {
        item.checked = true
      } else {
        item.checked = false
      }
    }
    this.setData({
      creditAmountTest: selectUpdata
    })
  },
  bindPrevious: function () {
    if (this.data.creditAmountIndex > 0) {
      this.setData({
        creditAmountIndex: this.data.creditAmountIndex - 1,
        isUserInfo: true
      })
    }
  },
  bindNext: function (e) {
    var that = this
    var isTrue = false
    var selectUpdata = ''
    var listLength = that.data.creditAmountTest.length - 1
    if (that.data.creditAmountTest != '') {
      selectUpdata = that.data.creditAmountTest
      for (var i = 0; i < selectUpdata[that.data.creditAmountIndex].items.length; i++) {
        if (selectUpdata[that.data.creditAmountIndex].items[i].checked == true) {
          isTrue = true
        }
      }
    }
    if (that.data.creditAmountIndex == listLength - 1 && isTrue) {
      that.setData({
        isUserInfo: false
      })
    }
    if (that.data.creditAmountIndex == listLength && that.data.creditAmountTest != '' && isTrue) {
      if (e.detail.userInfo) {
        that.setData({
          avatarUrl: e.detail.userInfo.avatarUrl,
          userName: e.detail.userInfo.nickName
        })
        var resultArr = []
        var sct = that.data.creditAmountTest
        for (var i = 0; i < sct.length; i++) {
          let ra = []
          for (var x = 0; x < sct[i].items.length; x++) {
            if (sct[i].items[x].checked) {
              ra.push(sct[i].items[x].name)
            }
          }
          resultArr.push(ra)
        }
        wx.request({
          url: config.host + '/v1/questions/test_result',
          method: 'POST',
          header: {
            'Authorization': app.globalData.access_token,
            'Content-Type': 'application/json'
          },
          data: JSON.stringify({
            category: 'credit_amount_test',
            results: resultArr
          }),
          success: function (res) {
            if (res.data.message == "提交成功") {
              that.setData({
                question: !that.data.question
              })
            }
          }
        })
        that.answers()
      }
    } else if (that.data.creditAmountIndex < listLength && isTrue) {
      that.setData({
        creditAmountIndex: that.data.creditAmountIndex + 1
      })
    } else if (that.data.creditAmountIndex - 1 < listLength && !isTrue) {
      wx.showModal({
       title: '请选择',
       showCancel: false,
       content: '至少选中其中一项'
     })
    }
  },
  answers: function () {
    var that = this
    wx.request({
      url: config.host + '/v1/answers/recommend',
      method: 'GET',
      header: {
        'Authorization': app.globalData.access_token,
        'Content-Type': 'application/json'
      },
      success: function (res) {
        that.setData({
          answersData: res.data
        })
        that.dowFile(res.data.image_url)
        // that.createNewImg()
      }
    })
  },
  //适配不同屏幕大小的canvas    生成的分享图宽高分别是 750  和940，老实讲不知道这块到底需不需要，然而。。还是放了，因为不写这块的话，模拟器上的图片大小是不对的。。。
  setCanvasSize: function () {
    var size = {}
    try {
      var res = wx.getSystemInfoSync()
      var scale = 1300//画布宽度
      var scaleH = 2400 / 1300//生成图片的宽高比例
      var width = res.windowWidth//画布宽度
      var height = res.windowWidth * scaleH//画布的高度
      size.w = width
      size.h = height
      // var res = wx.getSystemInfoSync()
      // var width = (res.windowWidth - 40) * 2
      // var height = res.windowHeight
      // size.w = width
      // size.h = height
    } catch (e) {
      // Do something when catch error
      // console.log("获取设备信息失败" + e)
    }
    return size
  },
  //将1绘制到canvas的固定
  settextSentence: function (context) {
    let that=this
    var size = that.setCanvasSize()
    // 绘制文字
    var description = this.data.answersData.description
    var userName = this.data.userName
    var copywriting = this.data.copywriting
    if (copywriting.length > 15) {
      let arr = this.data.copywriting.split("@_@")
      if (arr.length > 0) {
        for (var i = 0;i < arr.length;i++) {
          that.changeLine(arr[i], size, context)
          that.setData({
            position: parseFloat(that.data.position) + 0.09
          })
        }
      }
    } else {
      context.setFontSize(30)
      context.setFillStyle("#ffffff")
      context.setTextAlign("center")
      context.fillText(that.data.copywriting, size.w * 0.82, size.h * 1.1)
    }
    context.setFontSize(40)
    context.setFillStyle("#27303A")
    context.setTextAlign("center")
    context.fillText(userName, size.w * 0.82, size.h * 0.15)

    context.setFontSize(30)
    context.setFillStyle("#27303A")
    context.setTextAlign("center")
    context.font = "bold"
    context.fillText(description, size.w * 0.85, size.h * 0.25)
    context.stroke()
  },
  //将2绘制到canvas的固定
  // settextDescribe: function (context) {
  //   let that = this
  //   var size = that.setCanvasSize()
  //   var describe = this.data.describe
  //   context.setFontSize(30)
  //   context.setTextAlign("center")
  //   context.setFillStyle("#666666")
  //   context.fillText(describe, size.w, size.h * 1.5)
  //   context.stroke()
  // },
  //将canvas转换为图片保存到本地，然后将图片路径传给image图片的src
  createNewImg: function () {
    var that = this
    var size = that.setCanvasSize()
    var context = wx.createCanvasContext('myCanvas')
    // 展示图
    var backImg = that.data.answersData.image_url
    // 小程序二维码
    var miniprogram = that.data.answersData.miniprogram_url
    var avatarUrl = that.data.avatarUrl
    var imageZw = "/layouts/assets/images/bankcard.png"
    context.setFillStyle('#ffffff')
    context.fillRect(0, 0, size.w * 2, size.h * 2)
    context.setFillStyle('#27303A')
    context.fillRect(0, size.h * 1, size.w * 1.8, size.h * 0.3)
    context.drawImage(backImg, size.w * 0.25, size.h * 0.35, size.w * 1.2, size.h * 0.5)
    context.drawImage(miniprogram, size.w * 0.45, size.h * 1.33, size.w * 0.8, size.h * 0.40)

    // context.drawImage(avatarUrl, size.w / 2 + 80, size.h * 0.76, 160, 160)
    // 绘制圆
    // this.circleImg(context, avatarUrl, size.w / 2 - 60, size.h * 0.32, 30, 0)
    // context.drawImage(imageZw, size.w / 2 - 25, size.h * 0.7, size.w * 0.14, size.w * 0.14)
    this.settextSentence(context)
    // this.settextDescribe(context)

    //绘制图片
    context.draw()
    //将生成好的图片保存到本地，需要延迟一会，绘制期间耗时
    wx.showToast({
      title: '生成中...',
      icon: 'loading',
      duration: 500
    })

    setTimeout(function () {
      wx.canvasToTempFilePath({
        canvasId: 'myCanvas',
        success: function (res) {
          var tempFilePath = res.tempFilePath
          that.setData({
            imagePath: tempFilePath,
            canvasHidden: false,
            maskHidden: true,
          })
　　　　　　//将生成的图片放入到《image》标签里
          var img = that.data.imagePath
          // wx.previewImage({
          //   current: img, // 当前显示图片的http链接
          //   urls: [img] // 需要预览的图片http链接列表
          // })
        },
        fail: function (res) {
          // console.log(res)
        }
      })
    }, 500)
  },
  circleImg: function (ctx, img, x, y, r) {
    ctx.save()
    var d = 2 * r
    var cx = x + r
    var cy = y + r
    ctx.arc(cx, cy, r, 0, 2 * Math.PI)
    ctx.clip()

    // ctx.setFillStyle('red')
    ctx.drawImage(img, x, y, d, d)
    ctx.restore()
  },
  changeLine: function (text, size, context) {
    var that = this
    let page = 20
    let num = text.length / page
    let position = this.data.position
    let subnum = 0
    for (var i = 0; i < Math.ceil(num); i++) {
      context.setFontSize(30)
      context.setTextAlign("center")
      context.setFillStyle("#ffffff")
      context.font = "30px Heiti SC"
      context.fillText(text.substr(subnum, page), size.w - 50, size.h * that.data.position)
      context.stroke()
      that.setData({
        position: parseFloat(that.data.position)
      })
      subnum += page
    }
  },
  previewImg: function (e) {
    var img = this.data.imagePath
    // wx.downloadFile({
    //   url: img, //仅为示例，并非真实的资源
    //   success: function(res) {
    //     if (res.statusCode === 200) {
    //       wx.playVoice({
    //         filePath: res.tempFilePath
    //       })
    //     }
    //   }
    // })

    wx.getImageInfo({
      src: img,
      success: function(res) {
        var path = res.path
        wx.saveImageToPhotosAlbum({
            filePath: path,
            success(result) {
              wx.showToast({
                title: '图片保存成功',
                icon: 'success'
              })
            }
        })
      }
    })

    // wx.previewImage({
    //   current: img, // 当前显示图片的http链接
    //   urls: [img] // 需要预览的图片http链接列表
    // })
  },
  getUser: function () {
    wx.getUserInfo({
      success: res => {
        that.setData({
          isUserInfo: true
        })
      }
    })
  },
  dowFile: function (url) {
    wx.downloadFile({
      url: url,
      success: function(res) {
        if (res.statusCode === 200) {
          wx.playVoice({
            filePath: res.tempFilePath
          })
          debugger
        }
      }
    })
  }
})
