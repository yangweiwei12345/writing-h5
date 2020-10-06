//index.js
//获取应用实例
const app = getApp()
const Auth = require('../../utils/auth');
const API = require('../../config/api.js');

Page({
  data: {
    wxlogin: true,

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

  /**
   * 获取当前用户个人资料
   * @date 2020-09-14
   * @returns {any}
   */
  getInfoData: function () {
    API.getUserInfo({
    }).then(res => {//成功
      this.setData({
        userInfo: res,
      })
    })
  },

  getUserInfoDetail: function() {
    this.setData({
      wxlogin: true
    });
    this.getInfoData();
  },
})
