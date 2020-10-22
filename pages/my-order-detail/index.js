//index.js
//获取应用实例
const API = require('../../config/api.js');

const TEXTS = {
  1: '付款成功',
  2: '待发货',
  3: '已发货',
  4: '已完成',
};

Page({
  data: {
    orderDetail: {},
    texts: TEXTS,
    transDetail: {
      kd_list: []
    }
  },

  onLoad: function (options) {
    this.setData({
      orderDetail: JSON.parse(options.data)
    });
  },
  onShow: function() {
    this.getTransDetail();
  },

  // 获取订单列表
  getTransDetail: function() {
    wx.showLoading({
      title: '数据加载中',
    });
    let params = {
      order_no: this.data.orderDetail.order_no
    };

    API.transDetail(params)
      .then(res => {
      
        this.setData({
          transDetail: res,
        });
        wx.hideLoading();
      })
      .catch(e => {
        wx.hideLoading();
      })
  },
  

})
