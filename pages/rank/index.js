//index.js
//获取应用实例
const API = require('../../config/api.js');
const TYPES = {
  'week': '周',
  'month': '月',
  'like': '人气',
  'rank': '上榜'
};

Page({
  data: {
    // 排行榜数据
    rankingData: [],
    rankPage: {
      page: 1,
      pageSize: 20
    },
    hasMore: true,
    params: {}
  },
  onLoad: function (options) {
    const { date, type } = options;
    let title = `本${TYPES[date]}${TYPES[type]}之星`;

    wx.setNavigationBarTitle({
      title
    })

    this.setData({
      params: options
    }, () => {
      this.getRank();
    });
  },
  onShow: function() {
  },

  // 获取排行榜数据
  getRank: function() {
    const { params, rankPage } = this.data;
    let param = {
      ...rankPage,
      time_type: params.date === 'week' ? 'week' : 'month',
      rank_type: params.type === 'like' ? 1 : 2
    };
    wx.showLoading({
      title: '数据加载中...',
    });

    API.ranking(param)
      .then(res => {
        let data = res && res.rows || [];

        this.setData({
          hasMore: data.length >= rankPage.pageSize,
          rankingData: this.data.rankingData.concat(data),
          rankPage: {
            ...rankPage,
            page: rankPage.page + 1
          }
        });
        wx.hideLoading();
      }).catch(e => {
        wx.hideLoading();
      })
  },


  // 上拉加载
  onReachBottom() {
    const { hasMore } = this.data;

    if(!hasMore) {
      return;
    }

    this.getRank();
    
  },

  toUserInfo: function(e) {
    const { userid } = e.currentTarget.dataset;

    wx.navigateTo({
      url: '/pages/my-other/index?user_id=' + userid
    })
  },



})
