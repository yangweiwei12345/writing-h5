//index.js
const app = getApp()
const Auth = require('../../utils/auth');
const API = require('../../config/api.js');

Page({
  data: {
    wxlogin: true,
    statusBarHeight: app.globalData.statusBarHeight,

    userInfo: {},
    goodPage: {
      page: 1,
      pageSize: 20
    },
    goodsList: [],
    hasMore: true,

    opacity: 0,

    weekTaskData: [],
    taskListData: [],

    showTask: false,

    weeks: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
  },
  onLoad: function () {
  },
  onShow: function() {
    if (typeof this.getTabBar === 'function' &&
      this.getTabBar()) {
      this.getTabBar().setData({
        selected: 2
      })
    }

    this.isLogin();

    this.setData({
      goodPage: {
        page: 1,
        pageSize: 20
      },
      goodsList: [],
      hasMore: true
    }, () => {
      this.getGoodList();
    });
  },


  // 是否登录
  isLogin: function() {
    // 是否登录
    Auth.checkHasLogined()
      .then(res => {
        if(res) {
          this.setData({
            wxlogin: true
          }, () => {
            // 用户登录之后查看当前个人资料是否填写
            this.getInfoData();
            this.getWeekTask();
            this.getTaskList();
          });
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

  getGoodList: function() {
    wx.showLoading({
      title: '数据加载中',
    });
    const { goodPage } = this.data;
    let params = {
      ...goodPage
    };

    API.goodsList(params)
      .then(res => {
        let data = res && res.rows || [];
      
        this.setData({
          hasMore: data.length >= goodPage.pageSize,
          goodsList: data,
          goodPage: {
            ...goodPage,
            page: goodPage.page + 1
          }
        });
        wx.hideLoading();
      })
      .catch(e => {
        wx.hideLoading();
      })
  },

  // 打卡日历
  getWeekTask: function() {
    API.getWeekTask({})
      .then(res => {
        let data = res || [];
      
        this.setData({
          weekTaskData: data,
        });
      })
      .catch(e => {
      })
  },

  // 任务列表
  getTaskList: function() {
    API.taskList({})
      .then(res => {
        let data = res || [];
      
        this.setData({
          taskListData: data,
        });
      })
      .catch(e => {
      })
  },

  toGold: function() {
    wx.navigateTo({
      url: '/pages/shop-gold/index'
      // url: '/pages/open-course/index'
    })
  },

  toShopDetail: function(e) {
    const { item } = e.currentTarget.dataset;
    const { userInfo } = this.data;

    wx.navigateTo({
      url: '/pages/shop-detail/index?data=' + JSON.stringify(item) + "&userInfo=" + JSON.stringify(userInfo)
    })
  },

  onShowTask: function() {
    this.setData({
      showTask: !this.data.showTask
    });
  },

  // 上拉加载
  onReachBottom() {
    const { hasMore } = this.data;

    if(hasMore) {
      this.getGoodList();
    }
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
