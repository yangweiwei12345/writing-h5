//index.js
//获取应用实例
const API = require('../../config/api.js');

Page({
  data: {
    userInfo: {},
    active: 'all',
    workList: []
  },
  onLoad: function () {
  },
  onShow: function() {
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

  onChange: function(e) {
    let { name } = e.detail;

    this.setData({
      active: name
    });
  }

})
