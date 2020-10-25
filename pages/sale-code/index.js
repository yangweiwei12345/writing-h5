//index.js
const util = require('../../utils/util');
const API = require('../../config/api.js');

Page({
  data: {
    showOrder: false,
    orderData: [],
    courseData: [],

    courseDetail: {},

    orderPage: {
      page: 1,
      pageSize: 20
    },
    hasMore: true,
    active: 'no'
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
    const { orderPage, courseDetail, active } = this.data;
    let params = {
      ...orderPage,
      status: active === 'no' ? 0 : 1
    };

    if(courseDetail && courseDetail.courseId) {
      params.courseId = courseDetail.courseId;
    }

    wx.showLoading({
      title: '数据请求中...',
    });

    API.record(params)
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

  onShowSelect: function(e) {
    const { item } = e.target.dataset;

    this.setData({
      showOrder: !this.data.showOrder,
      courseDetail: item || {}
    });
  },

  onChange: function(e) {
    this.setData({
      active: e.detail.name
    }, () => {
      this.onGetOrder();
    });
  },

  onCopy: function(e) {
    const { text } = e.currentTarget.dataset;
    wx.setClipboardData({
      data: text,
      success () {
        wx.showToast({
          title: '复制成功',
          icon: 'nonoe'
        })
      }
    });
  },

  toUser: function(e) {
    const { id } = e.currentTarget.dataset;

    wx.navigateTo({
      url: '/pages/sale-people/index?courseId=' + id
    })
  }

})
