//index.js
const API = require('../../config/api.js');
const config = require('../../config/config.js');

Page({
  data: {
    params: {},
    paginaData: {
      page: 1,
      pageSize: 20
    },
    workList: [],
    count: 0,

    hasMore: true
  },
  onLoad: function (options) {
    this.setData({
      params: {
        ...options
      }
    }, () => {
      this.getWork();
    });
  },
  onShow: function() {
  },

  toWorkDetail: function(e) {
    const { id } = e.currentTarget.dataset;

    wx.navigateTo({
      url: '/pages/work-detail/index?work_id=' + id
    })
  },

  getWork: function() {
    API.courseWorkList({
      ...this.data.paginaData,
      user_id: this.data.params.user_id
    }).then(res => {//成功
      let data = res && res.rows || [];
      let hasMore = true;
      let { workList, paginaData } = this.data;

      if(data.length < paginaData.pageSize) {
        hasMore = false; 
      }
      this.setData({
        hasMore,
        workList: workList.concat(data),
        count: res && res.count || 0,
        paginaData: {
          ...paginaData,
          page: paginaData.page + 1
        }
      })

    })
  },

  // 上拉加载
  onReachBottom() {
    const { hasMore } = this.data;

    if(!hasMore) {
      return;
    }

    this.getWork();
    
  }

})
