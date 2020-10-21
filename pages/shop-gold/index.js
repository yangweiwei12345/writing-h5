//index.js
const app = getApp()
const Auth = require('../../utils/auth');
const API = require('../../config/api.js');

Page({
  data: {
    statusBarHeight: app.globalData.statusBarHeight,
  },
  onLoad: function () {
  },
  onShow: function() {
    
  },

  goBack: function() {
    wx.navigateBack({
      delta: 1
    });
  },

})
