//index.js
const app = getApp();
const API = require('../../config/api.js');
console.log(app.globalData.courseDetail);

Page({
  data: {
    height: 0,

    showFirst: false,
    params: {},
    courseDetail: {}
  },
  onLoad: function (options) {
    this.setData({
      params: JSON.parse(options.data || '{}'),
      courseDetail: app.globalData.courseDetail || {}
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
  onUnload: function () {
    wx.navigateBack({
      delta: 1
    })
  },
  onShowClick: function(is_clock) {
    for(let i = 0; i < 4; i++) {
      setTimeout(() => {
        this.setData({
          ['show' + i]: !this.data['show' + i]
        });
      }, 1000 * (i + 1));
    }

    setTimeout(() => {
      console.log('动画完成')

      console.log(is_clock);
      if(is_clock === 1) {
        var pages = getCurrentPages();
        var prevPage = pages[pages.length - 3]; //上一个页面
        console.log(prevPage);
        prevPage.lookFinish();
      }

      wx.navigateBack({
        delta: 1
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
      console.log(res);
      this.onShowClick(res.is_clock);
      wx.hideLoading();
    }).catch(err => {
      wx.hideLoading();
    })
  }
})
