//index.js
//获取应用实例
const API = require('../../config/api.js');

Page({
  data: {
    workDetail: {},
    work_id: ''
  },
  onLoad: function (options) {
    this.setData({
      work_id: options.work_id
    }, () => {
      this.getWorkDetail();
    });
  },
  onShow: function() {
    
  },

  /**
   * 获取当前用户个人资料
   * @date 2020-09-14
   * @returns {any}
   */
  getWorkDetail: function () {
    API.workDetail({
      work_id: this.data.work_id
    }).then(res => {//成功
      this.setData({
        workDetail: res
      });
    })
  },


})
