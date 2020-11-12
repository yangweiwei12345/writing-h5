//index.js
//获取应用实例
const app = getApp()
const Auth = require('../../utils/auth');
const API = require('../../config/api.js');

Page({
  data: {
    wxlogin: true,
    statusBarHeight: app.globalData.statusBarHeight,

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

    active: 'userCourse',

    userCourseHaveMore: true,
    courseHaveMore: true,

    opacity: 0,
    userInfo: {}
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

    this.isLogin();
  },

  // 是否登录
  isLogin: function() {
    // 是否登录
    Auth.checkHasLogined()
      .then(res => {
        if(res) {
          this.setData({
            courseList: [],
            userCourseList: [],
            pageData: {
              page: 1,
              pageSize: 10
            },
            userPageData: {
              page: 1,
              pageSize: 10
            },
            userCourseHaveMore: true,
            courseHaveMore: true
          }, () => {
            this.getUserCourseList();
            this.getCourseList();
          })
          this.setData({
            wxlogin: true
          });
          this.getInfoData()
        } else {
          this.setData({
            wxlogin: false
          });
        }
      }).catch(e => {
        this.setData({
          wxlogin: false
        });
      })
  },

  /**
   * 获取当前用户个人资料
   * @date 2020-09-14
   * @returns {any}
   */
  getInfoData: function () {
    wx.showLoading({
      title: '请求中...',
    });
    API.getUserInfo({
    }).then(res => {//成功
      this.setData({
        userInfo: res,
      })
      wx.hideLoading();
    }).catch(e => {
      wx.hideLoading();
    })
  },

  getUserInfoDetail: function() {
    this.setData({
      wxlogin: true
    });
    this.getInfoData();
  },


  toLogin: function() {
    this.setData({
      wxlogin: false
    });
  },

  getUserInfoDetail: function() {
    this.setData({
      wxlogin: true
    });

    this.getUserCourseList();
  },

  onTabsChange: function(e) {
    this.setData({
      active: e.detail.name,
      pageData: {
        page: 1,
        pageSize: 10
      },
      userPageData: {
        page: 1,
        pageSize: 10
      },
      userCourseHaveMore: true,
      courseHaveMore: true,
      userCourseList: [],
      courseList: []
    }, () => {
      if(this.data.active === 'userCourse') {
        this.getUserCourseList();
      } else {
        this.getCourseList();
      }
    });
  },
  spree:function(){
    wx.navigateTo({
      url:'/pages/spree/index'
    })
  },

  toDetail: function(e) {
    const { title, id, num, dt } = e.currentTarget.dataset;

    if(parseInt(num) <= 0) {
      wx.showToast({
        title: '已过期，请联系老师',
        icon: 'none'
      })
      return;
    }
    console.log(dt)

    wx.navigateTo({
      url: '/pages/course-detail/index?courseId=' + id 
    });
    app.globalData.courseDetail = {
      ...dt
    };
  },

  // 获取我的课程
  getUserCourseList: function() {
    if(this.isUserCousrLoad) {
      return;
    }
    this.isUserCousrLoad = true;

    API.userCourseList({
      ...this.data.userPageData
    }).then(res => {//成功
      let data = res && res.rows || [];
      let { userPageData } = this.data;

      this.setData({
        userCourseList: this.data.userCourseList.concat(data),
      })

      if(data.length >= userPageData.pageSize) {
        this.setData({
          userPageData: {
            ...userPageData,
            page: userPageData.page + 1
          }
        });
      } else {
        this.setData({
          userCourseHaveMore: false
        });
      }
      this.isUserCousrLoad = false;
    })
  },

  // 获取课程列表
  getCourseList: function() {
    if(this.isCourseLoad) {
      return;
    }

    this.isCourseLoad = true;
    API.courseList({
      ...this.data.pageData
    }).then(res => {//成功

      let data = res && res.rows || [];
      let { pageData } = this.data;

      this.setData({
        courseList: this.data.courseList.concat(data),
      })

      if(data.length >= pageData.pageSize) {
        this.setData({
          pageData: {
            ...pageData,
            page: pageData.page + 1
          }
        });
      } else {
        this.setData({
          courseHaveMore: false
        });
      }
      this.isCourseLoad = false;

    })
  },

  // 下拉刷新
  // onPullDownRefresh() {
  //   this.setData({
  //     pageData: {
  //       page: 1,
  //       pageSize: 10
  //     }, 
  //     userPageData: {
  //       page: 1,
  //       pageSize: 10
  //     }
  //   }, () => {
  //     if(this.data.active === 'userCourse') {
  //       this.getUserCourseList();
  //     } else {
  //       this.getCourseList();
  //     }
  //   });
  // }

  // 上拉加载
  onReachBottom() {
    const { active, courseHaveMore, userCourseHaveMore } = this.data;
    if(active === 'userCourse') {
      if(userCourseHaveMore) {
        this.getUserCourseList();
      }
    } else {
      if(courseHaveMore) {
        this.getCourseList();
      }
    }
  },


  onShareAppMessage: function() {
    return {
      title: `上考拉熊写字，给卷面加分，干货大礼包！`,
      path: `/pages/course/index`,
      imageUrl: 'http://cdn.koalaxiezi.com/Writing/share.jpg'
    };
  },
  
  onPageScroll: function (e) {
    let top = e.scrollTop;

    tt && clearTimeout(tt);
    let tt = setTimeout(() => {
      let opacity = top / 50;

      this.setData({
        opacity
      })
    }, 200);
  },


})
