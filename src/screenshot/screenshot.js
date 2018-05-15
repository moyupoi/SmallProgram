// import config from '../../config'
// const app = getApp()
//
// Page({
//   data: {
//     bankName: '',
//     imagePath: ''
//   },
//   onLoad: function (options) {
//     this.setData({
//       bankName: options.title
//     })
//     this.createNewImg()
//     // getCurrentPages()
//   },
//   createNewImg: function() {
//     var that = this
//     var context = wx.createCanvasContext('mycanvas')
//     var path = "/layouts/assets/images/bankcard.png"
//     //将模板图片绘制到canvas,在开发工具中drawImage()函数有问题，不显示图片
//     //不知道是什么原因，手机环境能正常显示
//     context.drawImage(path, 0, 0,686,686)
//     context.setFillStyle('#832d3b')
//     context.setFontSize(10)
//     context.fillText("测试", 60, 130, 100)
//     // context.draw(true)
//     // context.draw()
//     // this.setMoney(context)
//     // this.setName(context)
//     //绘制图片
//     context.draw()
//     //将生成好的图片保存到本地，需要延迟一会，绘制期间耗时
//     wx.showToast({
//         title: '分享图片生成中...',
//         icon: 'loading',
//         duration:1000
//     })
//     setTimeout(function(){
//       wx.canvasToTempFilePath({
//         canvasId: 'mycanvas',
//         success: function (res) {
//           var tempFilePath = res.tempFilePath
//           console.log(tempFilePath)
//           that.setData({
//             imagePath: tempFilePath,
//             // canvasHidden:true
//           })
//         },
//         fail: function (res) {
//           console.log(res)
//         }
//       })
//     },200)
//   },
//   previewImg: function (e) {
//     var img = this.data.imagePath
//     wx.previewImage({
//       current: img, // 当前显示图片的http链接
//       urls: [img] // 需要预览的图片http链接列表
//     })
//   }
// })


//share.js
Page({
  data: {
    imagePath: "",
    imageBanner: "/layouts/assets/images/bankcard.png",
    maskHidden: true,
    avatarUrl: "",
    sentence: "像你这样优秀温婉不败的小姐姐，信用卡可以换一座紫禁城~~@_@就是，你还缺男朋友吗？介不介意换一个？",
    position: "1.18",
  },

  onLoad: function (options) {
    let that = this
    // 页面初始化 options为页面跳转所带来的参数
    //动态设置画布大小
    var size = this.setCanvasSize()
    wx.getUserInfo({
      success:function(res){
        wx.getImageInfo({
          src:res.userInfo.avatarUrl,
          success:function(res){
            that.setData({
              avatarUrl: res.path
            })
            that.createNewImg();
          }
        })
      }
    })
    //创建初始化图片
  },
  //适配不同屏幕大小的canvas    生成的分享图宽高分别是 750  和940，老实讲不知道这块到底需不需要，然而。。还是放了，因为不写这块的话，模拟器上的图片大小是不对的。。。
  setCanvasSize: function () {
    var size = {}
    try {
      var res = wx.getSystemInfoSync()
      var scale = 1440//画布宽度
      var scaleH = 1880 / 1440//生成图片的宽高比例
      var width = res.windowWidth//画布宽度
      var height = res.windowWidth * scaleH//画布的高度
      size.w = width
      size.h = height
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
    var sentence = this.data.sentence
    if (sentence.length > 15) {
      let arr = this.data.sentence.split("@_@")
      if (arr.length > 0) {
        for (var i = 0;i < arr.length;i++) {
          that.changeLine(arr[i], size, context)
          that.setData({
            position: parseFloat(that.data.position) + 0.1
          })
        }
      }
    } else {
      context.setFontSize(30)
      context.setTextAlign("center")
      context.setFillStyle("#666666")
      context.fillText(sentence, size.w, size.h * 1.3)
      context.stroke()
    }
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
    var path = "/layouts/assets/images/bankcard.png"
    var imageBanner = that.data.imageBanner
    var avatarUrl = that.data.avatarUrl
    var imageZw = "/layouts/assets/images/bankcard.png"
    context.setFillStyle('#ffffff')
    context.fillRect(0, 0, size.w * 2, size.h * 3)
    context.drawImage(imageBanner, 0, 0, 800, 400)
    context.drawImage(avatarUrl, size.w / 2 + 80, size.h * 0.76, 160, 160)
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
      context.setFillStyle("#666666")
      context.font = "30px Heiti SC"
      context.fillText(text.substr(subnum, page), size.w -20, size.h * that.data.position)
      context.stroke()
      that.setData({
        position: parseFloat(that.data.position) + 0.1
      })
      subnum += page
    }
  },
  previewImg: function (e) {
    var img = this.data.imagePath
    wx.previewImage({
      current: img, // 当前显示图片的http链接
      urls: [img] // 需要预览的图片http链接列表
    })
  }
  /*
  ctx.strokeStyle = "#009cff"
          ctx.shadowBlur = 10
          ctx.shadowColor = "#009cff"
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.ellipse(0, 0, 400, 400)
          ctx.closePath()
          ctx.stroke();
          ctx.clip()
          ctx.drawImage('516.png', 0, 0)
          ctx.stroke()
          ctx.restore()
  */
  // drwaHeadimg:function(ctx,img_url){
  //   ctx.save();
  //   ctx.setStrokeStyle("#ffffff");
  //   //ctx.shadowBlur = 10;
  //   //ctx.sha
  //   ctx.beginPath();
  //   ctx.
  // }
})
