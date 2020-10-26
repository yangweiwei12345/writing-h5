//index.js
const API = require('../../config/api.js');

Page({
  data: {
    userPage: {
      page: 1,
      pageSize: 20
    },
    hasMore: true,
    userData: []
  },
  onLoad: function (options) {
    // this.setData({
    //   courseId: options.courseId
    // });
    this.getOrder();
  },
  onShow: function() {
  },

  // 获取分销订单
  getOrder: function() {
    const { userPage, courseId } = this.data;
    let params = {
      ...userPage,
      courseId
    };

    wx.showLoading({
      title: '数据请求中...',
    });

    API.customer(params)
      .then(res => {
        let data = res && res.items || []
        this.setData({
          userData: this.data.userData.concat(data),
          hasMore: data.length >= userPage.pageSize,
          userPage: {
            page: userPage.page + 1,
            ...userPage
          }
        });
        wx.hideLoading();

      })
      .catch(e => {
        wx.hideLoading();
      })
  },


  // 上拉加载
  onReachBottom() {
    const { hasMore } = this.data;

    if(hasMore) {
      this.getOrder();
    }

  },


})
