//index.js
//获取应用实例
const app = getApp()
const Auth = require('../../utils/auth');
const API = require('../../config/api.js');

Page({
  data: {
    wxlogin: true,
    statusBarHeight: app.globalData.statusBarHeight,

    userInfo: {}
  },
  onLoad: function () {
  },
  onShow: function() {
    if (typeof this.getTabBar === 'function' &&
      this.getTabBar()) {
      this.getTabBar().setData({
        selected: 3
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
            wxlogin: true
          }, () => {
            // 用户登录之后查看当前个人资料是否填写
            this.getInfoData()
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

  toLogin: function() {
    this.setData({
      wxlogin: false
    });
  },

  toEditInfo: function() {
    if(!this.data.wxlogin) {
      this.setData({
        wxlogin: false
      });
      return;
    }
    wx.navigateTo({
      url: '/pages/my-info/index'
    });
  },

  toMyWorks: function() {
    if(!this.data.wxlogin) {
      this.setData({
        wxlogin: false
      });
      return;
    }

    wx.navigateTo({
      url: '/pages/my-works/index?user_id=' + this.data.userInfo.user_id
    })
  },
  kefu:function(e) {
    const { link, type, title } = e.currentTarget.dataset;
    wx.navigateTo({
      url: '/pages/webview/index?url=' + link + '&title=' + title
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

  onShareAppMessage: function() {
    const { userInfo } = this.data;

    return {
      title: `欢迎光临@${userInfo.nick_name}同学的主页`,
      path: `/pages/my-other/index?user_id=${userInfo.user_id}`
      //imageUrl: userInfo.head_img
    };
  }
})
