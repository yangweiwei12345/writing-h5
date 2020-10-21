//index.js
//获取应用实例
const API = require('../../config/api.js');

Page({
  data: {
    active: 'pending',
  },
  onLoad: function (options) {
    
  },
  onShow: function() {
  },

  // 设置选中已办
  onSelectPended: function() {
    this.setData({
      active: 'pended'
    }, () => {
      this.getPendedWorks();
    });
  },

  // 获取作业列表
  getPendingWorks: function() {
    API.courseWorkList({
      status: 2,
      t_id: this.data.user_id,
      ...this.data.pendingPage
    }).then(res => {//成功
      this.setData({
        workList: res && res.rows || [],
        pendingCount: res && res.count || 0
      });
    })
  },

  toOrderDetail: function(e) {
    const { id } = e.currentTarget.dataset;

    wx.navigateTo({
      url: '/pages/my-order-detail/index?order_id=' + id
    })
  },

})
