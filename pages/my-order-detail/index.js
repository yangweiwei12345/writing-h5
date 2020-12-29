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
    },
    showMore: false
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

    API.trans(params)
      .then(res => {
        let data = res || [];
        data.forEach(item => {
          item.time = this.getTime(item.time * 1000)
        })
      
        this.setData({
          transDetail: data,
        });
        wx.hideLoading();
      })
      .catch(e => {
        wx.hideLoading();
      })
  },

  getTime: function(time) {
    let date = new Date(time);

    let year = date.getFullYear(),
        month = date.getMonth() + 1,
        day = date.getDay(),
        hour = date.getHours(),
        miutes = date.getMinutes(),
        second = date.getSeconds();
    
    return `${year}-${this.fixTime(month)}-${this.fixTime(day)} ${this.fixTime(hour)}:${this.fixTime(miutes)}:${this.fixTime(second)}`;
  },

  fixTime: function(num) {
    return num < 10 ? '0' + num : num;
  },

  onMore: function() {
    this.setData({
      showMore: !this.data.showMore
    });
  }
  

})
