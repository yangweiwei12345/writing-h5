//index.js
//获取应用实例
const app = getApp()
const API = require('../../config/api.js');
const Auth = require('../../utils/auth');

Page({
  data: {
    statusBarHeight: app.globalData.statusBarHeight,
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
      pageSize: 20
    },
    count: 0,
    opacity: 0,

    active: 'newComment',

    activeTab: 'index',
    hasMore: true,
    wxlogin: true,

    // 排行榜数据
    rankingLikeData: [],
    rankingRankData: [],
    rankPage: {
      page: 1,
      pageSize: 10
    },
    activeDate: 'week',
    activeDateText: '周',

    // 上墙数据
    commendPage: {
      page: 1,
      pageSize: 20
    },
    commendData: [],
    hasCommendMore: true
  },
  loadWork: false,
  loaded: false,
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

    this.getInitIndexData();

  },
  onShow: function() {
    if (typeof this.getTabBar === 'function' &&
      this.getTabBar()) {
      this.getTabBar().setData({
        selected: 0
      })
    }

    this.isLogin();
  },

  // 获取首页数据
  getIndexData: function() {
    // banner
    this.getBanner();
    this.getNews();
    this.getCourse();
    this.getWork();
  },

  getInitIndexData: function() {
    if(this.loaded) {
      return;
    }

    this.loaded = true;
    if(this.data.activeTab === 'index') {
      this.setData({
        workList: [],
        paginaData: {
          page: 1,
          pageSize: 20
        },
        hasMore: true,
      }, () => {
        this.getIndexData();
      });
    } else if(this.data.activeTab === 'rank') {
      this.getRankData();
    } else if(this.data.activeTab === 'praise') {
      this.setData({
        commendPage: {
          page: 1,
          pageSize: 20
        },
        commendData: [],
        hasCommendMore: true
      }, () => {
        this.getQiangData();
      });
    }
  },

  getRankData: function() {
    this.getRank(1);
    this.getRank(2);
  },

  getQiangData: function() {
    wx.showLoading({
      title: '数据加载中',
    });
    const { commendPage, commendData } = this.data;
    let params = {
      ...commendPage
    };

    API.commendList(params)
      .then(res => {
        let data = res && res.rows || [];
      
        this.setData({
          hasCommendMore: data.length >= commendPage.pageSize,
          commendData: commendData.concat(data),
          commendPage: {
            ...commendPage,
            page: commendPage.page + 1
          }
        });
        wx.hideLoading();
      })
      .catch(e => {
        wx.hideLoading();
      })
  },

  // 获取排行榜数据
  getRank: function(type) {
    wx.showLoading({
      title: '数据加载中',
    });
    let params = {
      ...this.data.rankPage,
      time_type: this.data.activeDate === 'week' ? 'week' : 'month',
      rank_type: type
    };

    API.ranking(params)
      .then(res => {
        let data = res && res.rows || [];

        if(type === 1) {
          this.setData({
            rankingLikeData: data
          });
        } else {
          this.setData({
            rankingRankData: data
          });
        }
        wx.hideLoading();
      })
      .catch(e => {
        wx.hideLoading();
      })
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
    if(this.loadWork) return;

    this.setData({
      loading: true
    });
    this.loadWork = true;
    wx.showLoading({
      title: '加载中...',
    });
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
    })
  },

  onTabsChange: function(e) {
    this.loaded = false;
    this.setData({
      activeTab: e.detail.name,
    }, () => {
      this.getInitIndexData();
    });
    
  },

  onChange: function(e) {
    this.setData({
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

  onChangeDate: function(e) {
    console.log(e.detail.name)
    this.setData({
      activeDate: e.detail.name,
      activeDateText: e.detail.name === 'week' ? '周' : '月'
    }, () => {
      this.getRankData();
    });
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
  
  // 排行榜列表
  onMore: function(e) {
    const { type } = e.currentTarget.dataset;
    const { activeDate } = this.data;

    wx.navigateTo({
      url: '/pages/rank/index?date=' + activeDate + '&type=' + type
    })
  },

  onLikeClick: function(e) {

    if(!this.wxlogin) {
      this.setData({
        wxlogin: false
      });
    }

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
    }).catch(err => {
      wx.showToast({
        title: err || '请求失败',
        icon: 'none'
      })
    })
  },


  onLikeCommendClick: function(e) {

    if(!this.wxlogin) {
      this.setData({
        wxlogin: false
      });
    }

    const { commendData } = this.data;
    const { id } = e.currentTarget.dataset;
    API.likeWork({
      work_id: id
    }).then(res => {
      commendData.forEach(item => {
        if(item.work_id == id) {
          item.like_num = item.is_like === 0 ? item.like_num + 1 : item.like_num - 1;
          item.is_like = item.is_like === 0 ? 1 : 0;
        }
      })
      this.setData({
        commendData
      });
    }).catch(err => {
      wx.showToast({
        title: err || '请求失败',
        icon: 'none'
      })
    })
  },

  // 滚动奥底部加载

  // 上拉加载
  onReachBottom() {
    const { hasMore, hasCommendMore, activeTab } = this.data;

    if(activeTab === 'index' && hasMore) {
      this.getWork();
    }

    if(activeTab === 'praise' && hasCommendMore) {
      this.getQiangData();
    }
  },

  onShareAppMessage: function() {
    return {
      title: `一手好字，孩子收益一生，考拉熊写字！`,
      path: `/pages/index/index`,
      imageUrl: 'http://cdn.koalaxiezi.com/Writing/logo.png'
    };
  },

  onPageScroll: function (e) {
    let top = e.scrollTop;

    // if(this.data.activeTab !== 'index') {
    //   return;
    // }

    tt && clearTimeout(tt);
    let tt = setTimeout(() => {
      let opacity = top / 50;

      this.setData({
        opacity
      })
    }, 200);
  },
})
