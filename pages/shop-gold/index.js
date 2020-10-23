//index.js
const app = getApp()
const Auth = require('../../utils/auth');
const API = require('../../config/api.js');

Page({
  data: {
    statusBarHeight: app.globalData.statusBarHeight,

    scorePage: {
      page: 1,
      pageSize: 20
    },
    hasMore: true,

    active: 'path',
    billData: [],
    opacity: 0,
    v_amount: 0
  },
  onLoad: function (options) {
    this.setData({
      v_amount: options.v_amount
    });

    this.scoreBillList();
  },
  onShow: function() {
    
  },

  // 获取积分列表
  scoreBillList: function() {
    wx.showLoading({
      title: '数据加载中',
    });
    const { scorePage, active } = this.data;
    let params = {
      ...scorePage,
      type: active === 'path' ? 2 : 1
    };

    API.scoreBillList(params)
      .then(res => {
        let data = res && res.rows || [];
      
        this.setData({
          hasMore: data.length >= scorePage.pageSize,
          billData: data,
          scorePage: {
            ...scorePage,
            page: scorePage.page + 1
          }
        });
        wx.hideLoading();
      })
      .catch(e => {
        wx.hideLoading();
      })
  },

  goBack: function() {
    wx.navigateBack({
      delta: 1
    });
  },

  // 上拉加载
  onReachBottom() {
    const { hasMore } = this.data;

    if(hasMore) {
      this.scoreBillList();
    }
  },

  onChange: function(e) {
    this.setData({
      active: e.detail.name,
      scorePage: {
        page: 1,
        pageSize: 20
      },
      billData: [],
      hasMore: true
    }, () => {
      this.scoreBillList();
    });
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
