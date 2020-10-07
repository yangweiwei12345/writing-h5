//index.js
const app = getApp();
const API = require('../../config/api.js');

Page({
  data: {
    height: 0,

    showFirst: false,
    params: {},
    courseDetail: app.globalData.courseDetail || {}
  },
  onLoad: function (options) {
    this.setData({
      params: JSON.parse(options.data || '{}')
    });
    try {
      const res = wx.getSystemInfoSync();
      let h = res.windowHeight - 200;
      this.setData({
        height: h
      });
    } catch (e) {
    }
  },
  onShow: function() {
    
  },
  onShowClick: function() {
    for(let i = 0; i < 4; i++) {
      setTimeout(() => {
        this.setData({
          ['show' + i]: !this.data['show' + i]
        });
      }, 1000 * (i + 1));
    }

    setTimeout(() => {
      console.log('动画完成')
      wx.navigateBack({
        delta: 2
      })
    }, 4500)
  },

  // 确认提交作业
  submit: function() {
    this.setData({
      showFirst: true
    });
  },

  // 提交按钮事件
  onSubmit: function() {
    let { params } = this.data;
    let data = {
      ...params,
      work_remark: ''
    };
    
    wx.showLoading({
      title: '正在上传作业...'
    });
    API.addCourseWork(data).then(res => {//成功
      // wx.navigateTo({
      //   url: `/pages/course-success/index`,
      // });
      this.submit();
      this.onShowClick();
      wx.hideLoading();
    }).catch(err => {
      wx.hideLoading();
    })
  }
})
