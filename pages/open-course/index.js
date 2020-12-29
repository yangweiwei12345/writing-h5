//index.js
//获取应用实例
const app = getApp()
const Auth = require('../../utils/auth');
const API = require('../../config/api.js');

Page({
  data: {
    wxlogin: true,
    statusBarHeight: app.globalData.statusBarHeight,

    showSuccess: false,
    showFail: false,
    showMask: false,

    // recordPage: {
    //   page: 1,
    //   pageSize: 20
    // },
    // hasMore: true,
    recordData: [],
    courseCode: '',

    successText: '',
    failText: ''
  },
  onLoad: function () {
    this.getRecord();

  },
  onShow: function() {
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

  getUserInfoDetail: function() {
    this.setData({
      wxlogin: true
    });
  },

  onShowMask: function() {
    this.setData({
      showMask: !this.data.showMask
    });
  },

  onSuccessClose: function() {
    this.setData({
      showSuccess: false
    });
  },

  onToLearn: function() {
    wx.switchTab({
      url: '/pages/course/index',
    });
  },

  onFailClose: function() {
    this.setData({
      showFail: false
    });
  },

  goBack: function() {
    wx.navigateBack({
      delta: 1
    });
  },

  // 开课
  openCourse: function() {
    const { courseCode, wxlogin } = this.data;

    if(!wxlogin) {
      this.toLogin();
      return;
    }

    let params = {
      writeNumber: courseCode
    };

    if(!courseCode) {
      wx.showToast({
        title: '请输入开课码',
        icon: 'none'
      })
      return;
    }

    wx.showLoading({
      title: '开课中...',
    });

    API.writeOff(params)
      .then(res => {
        wx.hideLoading();

        wx.showToast({
          title: '开课成功',
          icon: 'none'
        })

        this.setData({
          successText: res.success,
          showSuccess: true
        });

      })
      .catch(e => {
        wx.hideLoading();
        this.setData({
          showFail: true,
          failText: e
        });
      })
  },

  // 获取分销订单
  getRecord: function() {
    const { recordPage } = this.data;
    let params = {
      ...recordPage
    };

    wx.showLoading({
      title: '数据请求中...',
    });

    API.useRecord(params)
      .then(res => {
        let data = res || []
        this.setData({
          recordData: data,
          // hasMore: data.length >= recordPage.pageSize,
          // recordPage: {
          //   page: recordPage.page + 1,
          //   ...recordPage
          // }
        });
        wx.hideLoading();

      })
      .catch(e => {
        wx.hideLoading();
      })
  },

})
