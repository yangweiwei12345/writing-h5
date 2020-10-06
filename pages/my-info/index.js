//index.js
//获取应用实例
const API = require('../../config/api.js');

Page({
  data: {
    userInfo: {}
  },
  onLoad: function () {
  },
  onShow: function() {
    this.getInfoData();
  },

  /**
   * 获取当前用户个人资料
   * @date 2020-09-14
   * @returns {any}
   */
  getInfoData: function () {
    API.getUserInfo({
    }).then(res => {//成功
      this.setData({
        userInfo: res,
      })
    })
  },

})
