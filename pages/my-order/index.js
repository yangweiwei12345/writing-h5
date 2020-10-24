//index.js
//获取应用实例
const API = require('../../config/api.js');
const TYPES = {};
TYPES[TYPES['all']     = 0] = 'all';
TYPES[TYPES['pending'] = 2] = 'pending';
TYPES[TYPES['pended']  = 3] = 'pended';
TYPES[TYPES['finish']  = 4] = 'finish';
TYPES[TYPES['payed']        = 1] = 'payed';

const TEXTS = {
  1: '付款成功',
  2: '待发货',
  3: '已发货',
  4: '已完成',
};

Page({
  data: {
    active: 'all',

    orderData: [],
    orderPage: {
      page: 1,
      pageSize: 20
    },
    hasMore: true,
    types: TYPES,
    texts: TEXTS 
  },
  

  onLoad: function (options) {
    this.getOrderList();
  },
  onShow: function() {
  },

  // 获取订单列表
  getOrderList: function() {
    wx.showLoading({
      title: '数据加载中',
    });
    const { orderPage, active } = this.data;
    console.log(this.data.types[active], active, this.data.types);
    let params = {
      ...orderPage,
      type: this.data.types[active]
    };

    API.orderList(params)
      .then(res => {
        let data = res && res.rows || [];
        console.log(data);
      
        this.setData({
          hasMore: data.length >= orderPage.pageSize,
          orderData: data,
          orderPage: {
            ...orderPage,
            page: orderPage.page + 1
          }
        });
        wx.hideLoading();
      })
      .catch(e => {
        console.log(e);
        wx.hideLoading();
      })
  },
  
  toOrderDetail: function(e) {
    const { item } = e.currentTarget.dataset;

    wx.navigateTo({
      url: '/pages/my-order-detail/index?data=' + JSON.stringify(item)
    })
  },


  // 上拉加载
  onReachBottom() {
    const { hasMore } = this.data;

    if(hasMore) {
      this.getOrderList();
    }
  },

  onChange: function(e) {
    console.log(e);
    this.setData({
      active: e.detail.name,
      orderPage: {
        page: 1,
        pageSize: 20
      },
      orderData: [],
      hasMore: true
    }, () => {
      this.getOrderList();
    });
  },


})
