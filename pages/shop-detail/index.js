//index.js
const Auth = require('../../utils/auth');
const API = require('../../config/api.js');

Page({
  data: {
    showDialog: false,
    goodsDetail: {},
    userInfo: {},

    wxlogin: true,
  },
  onLoad: function (options) {
    this.setData({
      goodsDetail: JSON.parse(options.data),
      userInfo: JSON.parse(options.userInfo)
    });
  },
  onShow: function() {
    this.isLogin();
  },

  onClose: function() {
    this.setData({
      showDialog: false
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
          });
          this.getInfoData();
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

  onSubmit: function() {
    const { goodsDetail, userInfo, wxlogin } = this.data;

    console.log(wxlogin)
    if(!wxlogin) {
      this.setData({
        wxlogin: false
      });
      return;
    }

    if(parseInt(goodsDetail.price) > parseInt(userInfo.v_amount || 0)) {
      this.setData({
        showDialog: true
      });
      return;
    }

    wx.navigateTo({
      url: '/pages/shop-submit/index?data=' + JSON.stringify(goodsDetail) + '&userInfo=' + JSON.stringify(userInfo)
    })
  },

  getUserInfoDetail: function() {
    this.setData({
      wxlogin: true
    });
    this.getInfoData();
  },


})
