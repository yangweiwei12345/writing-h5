//index.js
//获取应用实例
const app = getApp()
const API = require('../../config/api.js');

Page({
  data: {
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    // 轮播
    bannerData: [],
    // 新闻
    newsData: {},
    // 课程
    courseList: [],
    // 作品
    workList: [],
    paginaData: {
      page: 1,
      pageSize: 10
    },
    count: 0,

    active: 'newUpload'
  },
  onLoad: function () {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
      })
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo
        })
      }
    }
  },
  onShow: function() {
    if (typeof this.getTabBar === 'function' &&
      this.getTabBar()) {
      this.getTabBar().setData({
        selected: 0
      })
    }
    // banner
    this.getBanner();
    this.getNews();
    this.getCourse();
    this.getWork();
  },

  getBanner: function() {
    API.banner({
      type: 1
    }).then(res => {//成功
      this.setData({
        bannerData: res && res.rows || []
      })
    })
  },

  getNews: function() {
    API.news({
    }).then(res => {//成功
      this.setData({
        newsData: res || {}
      })
    })
  },

  // 课程
  getCourse: function() {
    API.indexCourse({
      page: 1,
      pageSize: 4
    }).then(res => {//成功
      this.setData({
        courseList: res && res.rows || []
      })
    })
  },

  getWork: function() {
    API.courseWorkList({
      ...this.data.paginaData,
      status: this.data.active === 'newUpload' ? 0 : '1'
    }).then(res => {//成功
      this.setData({
        workList: res && res.rows || [],
        count: res && res.count || 0
      })
    })
  },

  onChange: function(e) {
    this.setData({
      active: e.detail.name
    }, () => {
      this.getWork();
    });
  },

  toWorkDetail: function(e) {
    const { id } = e.currentTarget.dataset;

    wx.navigateTo({
      url: '/pages/work-detail/index?work_id=' + id
    })
  },

  toNew: function(e) {
    const { link, type } = e.currentTarget.dataset;

    if(type == 1) {
      return;
    } else if(type == 2) {
      wx.navigateTo({
        url: '/pages/webview/index?url=' + link
      })
    }
  },

  onLikeClick: function(e) {
    const { workList } = this.data;
    const { id } = e.currentTarget.dataset;
    API.likeWork({
      work_id: id
    }).then(res => {
      workList.forEach(item => {
        if(item.work_id == id) {
          item.like_num = item.is_like === 0 ? item.like_num + 1 : item.like_num - 1;
          item.is_like = item.is_like === 0 ? 1 : 0;
        }
      })
      this.setData({
        workList
      });
    })
  }
})
