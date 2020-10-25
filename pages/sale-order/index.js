//index.js
const util = require('../../utils/util');
const API = require('../../config/api.js');

Page({
  data: {
    showOrder: false,
    courseData: [],
    orderData: [],

    courseDetail: {},

    orderPage: {
      page: 1,
      pageSize: 20
    },
    hasMore: true
  },
  onLoad: function () {
    this.getCourse();
    this.getOrder();
  },
  onShow: function() {
  },

  getCourse: function() {

    API.retailCourse({})
      .then(res => {
        this.setData({
          courseData: res || []
        });
      })
      .catch(e => {

      })

  },

  // 获取分销订单
  getOrder: function() {
    const { orderPage, courseDetail } = this.data;
    let params = {
      ...orderPage
    };

    if(courseDetail && courseDetail.courseId) {
      params.courseId = courseDetail.courseId;
    }

    wx.showLoading({
      title: '数据请求中...',
    });

    API.retailOrder(params)
      .then(res => {
        let data = res && res.items || []
        this.setData({
          orderData: this.data.orderData.concat(data),
          hasMore: data.length >= orderPage.pageSize,
          orderPage: {
            page: orderPage.page + 1,
            ...orderPage
          }
        });
        wx.hideLoading();

      })
      .catch(e => {
        wx.hideLoading();
      })
  },

  onGetOrder: function() {
    this.setData({
      orderPage: {
        page: 1,
        pageSize: 20
      },
      hasMore: true,
      orderData: []
    }, () => {
      this.getOrder();
    });
  },

  submit: function(e) {
    const { index, id } = e.currentTarget.dataset;
    const { orderData } = this.data;
    let item = orderData[index];
    let params = {
      id,
      remark: item.remark
    };

    wx.showLoading({
      title: '数据请求中...',
    });

    API.remark(params)
      .then(res => {
        wx.showToast({
          title: '请求成功',
          icon: 'none'
        })
        wx.hideLoading();
      })
      .catch(e => {
        wx.showToast({
          title: e || '提交失败',
          icon: 'none'
        })
        wx.hideLoading();
      })
  },

  onRemaskChange: function(e) {
    console.log(e);
    const { index } = e.currentTarget.dataset;
    const { orderData } = this.data;

    orderData[index].remark = e.detail;
    this.setData({
      orderData
    });
  },

  onShowSelect: function(e) {
    const { item } = e.target.dataset;

    this.setData({
      showOrder: !this.data.showOrder,
      courseDetail: item || {}
    });
  },

  // 上拉加载
  onReachBottom() {
    const { hasMore } = this.data;

    if(hasMore) {
      this.getOrder();
    }

  },



})
