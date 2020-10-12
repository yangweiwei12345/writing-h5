//index.js
const API = require('../../config/api.js');
const app = getApp();

Page({
  data: {
    courseWeekList: [],
    plan: 0,
    courseId: ''
  },
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: app.globalData.courseDetail && app.globalData.courseDetail.title || '课程章节'
    })
    this.setData({
      courseId: options.courseId
<<<<<<< HEAD
    }, () => {
      this.getCourseWeekList(options.courseId);
    });
  },
  onShow: function() {},

  toChapter: function(e) {
    const { weekid, weeknum } = e.currentTarget.dataset;
=======
    });
  },
  onShow: function() {
    setTimeout(() => {
      this.getCourseWeekList(this.data.courseId);
    }, 500)
  },

  toChapter: function(e) {
    const { weekid, weeknum, clock } = e.currentTarget.dataset;

    if(clock != 0) {
      return;
    }

>>>>>>> git-writing/master
    wx.navigateTo({
      url: `/pages/course-chapter/index?weekId=${weekid}&weekNum=${weeknum}&courseId=${this.data.courseId}`
    });
  },

  // 获取我的课程
  getCourseWeekList: function(course_id) {
    API.courseWeekList({
      course_id
    }).then(res => {//成功
      this.setData({
        courseWeekList: res && res.rows || [],
        plan: res && res.plan || 0
      })
    })
  },

})
