//index.js
//获取应用实例
const API = require('../../config/api.js');

Page({
  data: {
    userInfo: {},
    active: 'all',
    workList: [],
    paginaData: {
      page: 1,
      pageSize: 20
    },
    user_id: ''
  },
  onLoad: function (options) {
    this.setData({
      user_id: options.user_id
    }, () => {
      this.getOtherInfo();
      this.getWork();
    });
  },
  onShow: function() {
  },

  /**
   * 获取当前用户个人资料
   * @date 2020-09-14
   * @returns {any}
   */
  getOtherInfo: function () {
    API.otherInfo({
      user_id: this.data.user_id
    }).then(res => {//成功
      this.setData({
        userInfo: res,
      })
    })
  },

  getWork: function() {
    wx.showLoading({
      title: '加载中...',
    });
    const { active } = this.data;
    let params = {
      ...this.data.paginaData,
      user_id: this.data.user_id
    };
    if(active === 'all') {
      params.status = 0;
      params.sort = 0;
    } else if(active === 'like') {
      params.sort = 1;
    } else if(active === 'rank') {
      params.sort = 0;
      params.is_ranking = 1;
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
        count: res && res.count || 0,
        loading: false,
        paginaData: {
          ...paginaData,
          page: paginaData.page + 1
        }
      })
      wx.hideLoading();
    }).catch(e => {
      this.setData({
        loading: false
      });
      wx.hideLoading();
    })
  },


  onLikeClick: function(e) {

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


  // 上拉加载
  onReachBottom() {
    const { hasMore } = this.data;

    if(!hasMore) {
      return;
    }

    this.getWork();
    
  },

  onChange: function(e) {
    this.setData({
      active: e.detail.name,
      paginaData: {
        page: 1,
        pageSize: 20
      },
      workList: [],
      hasMore: true
    }, () => {
      this.getWork();
    });
  },

  toWorkDetail: function(e) {
    const { id } = e.currentTarget.dataset;

    wx.navigateTo({
      url: '/pages/work-detail/index?work_id=' + id
    })
  },
  onShareTimeline:function() {
    const { userInfo } = this.data;
    return {
      title: `欢迎光临@${userInfo.nick_name}同学的主页`,
    };
  },
  onShareAppMessage: function() {
    const { userInfo } = this.data;

    return {
      title: `欢迎光临@${userInfo.nick_name}同学的主页`,
      path: `/pages/my-other/index?user_id=${userInfo.user_id}`,
      //imageUrl: userInfo.head_img
    };
  }
})
