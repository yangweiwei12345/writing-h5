//index.js

Page({
  data: {
    src: ''
  },
  onLoad: function (options) {
    this.setData({
      src: options.url
    });
    wx.showLoading({
      title: "正在加载...",
      success: (result)=>{
      },
      fail: ()=>{},
      complete: ()=>{}
    });
  },
  onShow: function() {
  },

  onLoaded: function() {
    wx.hideLoading();
  },

  onError: function() {
    wx.hideLoading()
  }
})
