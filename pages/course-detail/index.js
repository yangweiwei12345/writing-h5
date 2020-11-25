//index.js
const API = require('../../config/api.js');
const app = getApp();
const rpx2px = require('../../utils/rpx2px');

Page({
  data: {
    courseWeekList: [],
    plan: 0,
    courseId: ''
  },
  isScroll: false,
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: app.globalData.courseDetail && app.globalData.courseDetail.title || '课程章节'
    })
    this.setData({
      courseId: options.courseId
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

    wx.navigateTo({
      url: `/pages/course-chapter/index?weekId=${weekid}&weekNum=${weeknum}&courseId=${this.data.courseId}`
    });
  },

  // 获取我的课程
  getCourseWeekList: function(course_id) {
    API.courseWeekList({
      course_id,
      user_course_id: app.globalData.courseDetail.user_course_id
    }).then(res => {//成功
      let data = res && res.rows || [];
      this.setData({
        courseWeekList: data,
        plan: res && res.plan || 0
      });


      if(this.isScroll) return;
      let count = 0;
      for(let i = 0; i < data.length; i++) {
        if(data[i].is_clock == 0) {
          count++;
        }
      }

      let scrollTop = rpx2px(194) + rpx2px(360) * (count - 1);
      wx.pageScrollTo({
        scrollTop: scrollTop,
        duration: 300
      });
      this.isScroll = true;
    })
  },

})
