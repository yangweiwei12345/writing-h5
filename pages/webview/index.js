//index.js

Page({
  data: {
    src: ''
  },
  onLoad: function (options) {
    this.setData({
      src: options.url
    });
    // 设置标题
    wx.setNavigationBarTitle({
      title: options.title || '新闻'
    })
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
