//index.js
//获取应用实例
const API = require('../../config/api.js');

Page({
  data: {
    active: 'pending',
    workList: [],
    pendingCount: 0,
    pendedCount: 0,
    teacherInfo: {},
    pendingPage: {
      page: 1,
      pageSize: 10
    },
    pended: {
      page: 1,
      pageSize: 10
    },
    teacherLevel: {
      0: '助教',
      1: '一级教室',
      2: '二级教室',
      3: '三级教室',
      4: '四级教室',
      5: '五级教室',
    }
  },
  onLoad: function (options) {
    console.log(options);
    this.setData({
      user_id: options.user_id
    }, () => {
      this.getTeacherInfo();
      this.getPendingWorks();
      this.getPendedWorks(true);
    });
  },
  onShow: function() {
  },

  // 设置选中已办
  onSelectPended: function() {
    this.setData({
      active: 'pended'
    }, () => {
      this.getPendedWorks();
    });
  },

  // 获取老师详情
  getTeacherInfo: function () {

    API.teacherInfo({
      user_id: this.data.user_id
    }).then(res => {//成功
      this.setData({
        teacherInfo: res
      });
    })
  },

  // 获取作业列表
  getPendingWorks: function() {
    API.courseWorkList({
      status: 2,
      t_id: this.data.user_id,
      ...this.data.pendingPage
    }).then(res => {//成功
      this.setData({
        workList: res && res.rows || [],
        pendingCount: res && res.count || 0
      });
    })
  },

  // 获取作业列表
  getPendedWorks: function(flag) {
    API.courseWorkList({
      status: 1,
      t_id: this.data.user_id,
      ...this.data.pendedPage
    }).then(res => {//成功
      if(!flag) {
        this.setData({
          workList: res && res.rows || []
        });
      }
      this.setData({
        pendedCount: res && res.count || 0
      });
    })
  },

  // 忽略作业
  onOverlookWork: function(e) {
    const { workid } = e.currentTarget.dataset;

    API.overlookWork({
      work_id: workid
    }).then(res => {//成功
      wx.showToast({
        title: '忽略成功',
        icon: ''
      })
      this.setData({
        pendingPage: {
          page: 1,
          pageSize: 10
        },
        workList: []
      }, () => {
        this.getPendingWorks();
      });
    })
  },

  onJudge: function(e) {
    const { workid, courseid, userid } = e.currentTarget.dataset;
    
    wx.navigateTo({
      url: `/pages/work-judge/index?work_id=${workid}&course_id=${courseid}&user_id=${userid}`
    })
  },

  toWorkDetail: function(e) {
    const { id } = e.currentTarget.dataset;

    wx.navigateTo({
      url: '/pages/work-detail/index?work_id=' + id
    })
  },

  onChange: function(e) {
    let { name } = e.detail;

    this.setData({
      active: name,
      pendingPage: {
        page: 1,
        pageSize: 10
      },
      pendedPage: {
        page: 1,
        pageSize: 10
      },
      workList: []
    }, () => {
      if(name === 'pending') {
        this.getPendingWorks();
      } else {
        this.getPendedWorks();
      }
    });
  }

})
