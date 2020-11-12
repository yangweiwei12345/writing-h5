//index.js

Page({
  data: {
  },
  onLoad: function () {
  },
  onShow: function() {
  },

  Sittingposition:function(){
    wx.navigateTo({
      url:'/pages/Sitting-position/index'
    })
  },

  Holdingpen:function(){
    wx.navigateTo({
      url:'/pages/Holding-pen/index'
    })
  },
  
  Wrist:function(){
    wx.navigateTo({
      url:'/pages/Wrist/index'
    })
  },

})
