//index.js
//获取应用实例
const app = getApp()
const API = require('../../config/api.js');

Page({
  data: {
    pageData: {
      page: 1,
      pageSize: 10
    },
    userPageData: {
      page: 1,
      pageSize: 10
    },

    // 我的课程列表
    userCourseList: [],
    // 课程列表
    courseList: [],

    active: 'userCourse'
  },
  onLoad: function () {
    
  },
  onShow: function() {
    if (typeof this.getTabBar === 'function' &&
      this.getTabBar()) {
      this.getTabBar().setData({
        selected: 1
      })
    }
    this.getUserCourseList();
    this.getCourseList();
  },

  onTabsChange: function(e) {
    this.setData({
      active: e.detail.name
    });
  },

  toDetail: function(e) {
    const { title, id } = e.currentTarget.dataset;
    wx.navigateTo({
      url: '/pages/course-detail/index?courseId=' + id 
    });
    app.globalData.courseDetail = {
      title
    };
  },

  // 获取我的课程
  getUserCourseList: function() {
    API.userCourseList({
      ...this.data.userPageData
    }).then(res => {//成功
      this.setData({
        userCourseList: res && res.rows || []
      })
    })
  },

  // 获取课程列表
  getCourseList: function() {
    API.courseList({
      ...this.data.pageData
    }).then(res => {//成功
      this.setData({
        courseList: res && res.rows || []
      })
    })
  }

})
