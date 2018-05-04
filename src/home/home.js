import config from '../../config'
const app = getApp()

Page({
  data: {
    recommendText: '今日推荐',
    officeCardText: '快速办卡',
    zhongxin: './images/zhongxin.png',
    officeCard: [{
      img: 'https://www.rong360.com/static/img/credit/bank/16.png',
      title: '中信银行',
      describe: '周三美食5折',
      rate: '45%'
    }, {
      img: 'https://www.rong360.com/static/img/credit/bank/13.png',
      title: '兴业银行',
      describe: '送iPhonex',
      rate: '30%'
    }, {
      img: 'https://www.rong360.com/static/img/credit/bank/3.png',
      title: '光大银行',
      describe: '送内裤',
      rate: '100%'
    }, {
      img: 'https://www.rong360.com/static/img/credit/bank/7.png',
      title: '交通银行',
      describe: '周末免费吃',
      rate: '60%'
    }, {
      img: 'https://www.rong360.com/static/img/credit/bank/10.png',
      title: '平安银行',
      describe: '免费电影票',
      rate: '10%'
    }, {
      img: 'https://www.rong360.com/static/img/credit/bank/11.png',
      title: '浦发银行',
      describe: '1元水果',
      rate: '80%'
    }],
    userInfo: {},
    hasUserInfo: false,
    movies: [{
      url:'http://img04.tooopen.com/images/20130712/tooopen_17270713.jpg'
    }, {
      url:'http://img04.tooopen.com/images/20130617/tooopen_21241404.jpg'
    }, {
      url:'http://img04.tooopen.com/images/20130701/tooopen_20083555.jpg'
    }, {
      url:'http://img02.tooopen.com/images/20141231/sy_78327074576.jpg'
    }],
    autoplay: false,
    indicatorDots: true,
    onLoad: function(options) {
      this.setData({
        title: options.title
      })
    }
  },
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  bindText: function() {
  },
  bindSkip: function() {
  },
  onLoad: function () {
  }
})
