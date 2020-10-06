//index.js
const API = require('../../config/api.js');

Page({
  data: {
    height: 0,

    showFirst: true,
    params: {},
  },
  onLoad: function (options) {
    try {
      const res = wx.getSystemInfoSync();
      let h = res.windowHeight - 200;
      this.setData({
        height: h
      });
    } catch (e) {
    }
  },
  onShow: function() {
  },
})
