//index.js
//获取应用实例
const app = getApp()
const API = require('../../config/api.js');
<<<<<<< HEAD

Page({
  data: {
=======
const Auth = require('../../utils/auth');

Page({
  data: {
    statusBarHeight: app.globalData.statusBarHeight,
>>>>>>> git-writing/master
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
<<<<<<< HEAD
      pageSize: 10
    },
    count: 0,

    active: 'newUpload'
  },
=======
      pageSize: 20
    },
    count: 0,
    opacity: 0,

    active: 'newComment',
    hasMore: true,
    wxlogin: true,
  },
  loadWork: false,
>>>>>>> git-writing/master
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
<<<<<<< HEAD
=======

    // banner
    this.getBanner();
    this.getNews();
    this.getCourse();
    this.setData({
      paginaData: {
        page: 1,
        pageSize: 20
      },
      workList: [],
      hasMore: true
    }, () => {
      this.getWork();
    });
>>>>>>> git-writing/master
  },
  onShow: function() {
    if (typeof this.getTabBar === 'function' &&
      this.getTabBar()) {
      this.getTabBar().setData({
        selected: 0
      })
    }
<<<<<<< HEAD
    // banner
    this.getBanner();
    this.getNews();
    this.getCourse();
    this.getWork();
=======

    this.isLogin();
  },


  // 是否登录
  isLogin: function() {
    // 是否登录
    Auth.checkHasLogined()
      .then(res => {
        if(res) {
          this.wxlogin = true
        } else {
          this.wxlogin = false
        }
      }).catch(e => {
        this.wxlogin = false
      })
  },

  getUserInfoDetail: function() {
    this.wxlogin = true;
>>>>>>> git-writing/master
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
<<<<<<< HEAD
    API.courseWorkList({
      ...this.data.paginaData,
      status: this.data.active === 'newUpload' ? 0 : '1'
    }).then(res => {//成功
      this.setData({
        workList: res && res.rows || [],
        count: res && res.count || 0
      })
=======
    if(this.loadWork) return;

    this.setData({
      loading: true
    });
    this.loadWork = true;
    // wx.showLoading({
    //   title: '加载中...',
    // });
    let params = {
      ...this.data.paginaData,
      status: this.data.active === 'newUpload' ? '2' : '1'
    };
    if(this.data.active === 'newComment') {
      params.sort = 2;
    }
    API.courseWorkList(
      params
    ).then(res => {//成功
      let data = res && res.rows || [];
      let hasMore = true;
      let { workList, paginaData } = this.data;

      if(data.length < paginaData.pageSize) {
        hasMore = false; 
      }
      this.setData({
        hasMore,
        workList: workList.concat(data),
        count: res && res.workCount || 0,
        loading: false,
        paginaData: {
          ...paginaData,
          page: paginaData.page + 1
        }
      })
      this.loadWork = false;
      wx.hideLoading();
    }).catch(e => {
      this.setData({
        loading: false
      });
      this.loadWork = false;
      wx.hideLoading();
>>>>>>> git-writing/master
    })
  },

  onChange: function(e) {
    this.setData({
<<<<<<< HEAD
      active: e.detail.name
    }, () => {
      this.getWork();
    });
  },

  onLikeClick: function(e) {
=======
      active: e.detail.name,
    });
    setTimeout(() => {
      this.setData({
        paginaData: {
          page: 1,
          pageSize: 20
        },
        workList: [],
        hasMore: true
      }, () => {
        this.getWork();
      });
    }, 300);
    
  },

  toWorkDetail: function(e) {
    const { id } = e.currentTarget.dataset;

    wx.navigateTo({
      url: '/pages/work-detail/index?work_id=' + id
    })
  },

  toNew: function(e) {
    const { link, type, title } = e.currentTarget.dataset;

    if(type == 1) {
      return;
    } else if(type == 2) {
      wx.navigateTo({
        url: '/pages/webview/index?url=' + link + '&title=' + title
      })
    }
  },

  toBanner: function(e) {
    const { link, type, title } = e.currentTarget.dataset;

    if(type == 1) {
      wx.navigateTo({
        url: '/pages/webview/index?url=' + link + '&title=' + title
      })
    } else if(type == 2) {
      wx.navigateTo({
        url:  link
      })
    }
  },

  onLikeClick: function(e) {

    if(!this.wxlogin) {
      this.setData({
        wxlogin: false
      });
    }

>>>>>>> git-writing/master
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
<<<<<<< HEAD
  }
=======
  },

  // 滚动奥底部加载

  // 上拉加载
  onReachBottom() {
    const { hasMore } = this.data;

    if(!hasMore) {
      return;
    }

    this.getWork();
    
  },

  onShareAppMessage: function() {
    return {
      title: `一手好字，孩子收益一生，卡拉熊写字！`,
      path: `/pages/index/index`,
      imageUrl: '../../resource/login/logo.png'
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
>>>>>>> git-writing/master
})
