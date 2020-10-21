//index.js
//获取应用实例
const app = getApp()
const Auth = require('../../utils/auth');
const API = require('../../config/api.js');

Page({
  data: {
    wxlogin: true,
    statusBarHeight: app.globalData.statusBarHeight,

    showSuccess: false,
    showFail: false,
    showMask: false
  },
  onLoad: function () {
  },
  onShow: function() {
   
  },

  onShowMask: function() {
    this.setData({
      showMask: !this.data.showMask
    });
  },

  onSuccessClose: function() {
    this.setData({
      showSuccess: false
    });
  },

  onToLearn: function() {
    wx.switchTab({
      url: '/pages/course/index',
    });
  },

  onFailClose: function() {
    this.setData({
      showFail: false
    });
  }

})
