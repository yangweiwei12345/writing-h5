//index.js

Page({
  data: {
    showDialog: false,
    goodsDetail: {},
    userInfo: {}
  },
  onLoad: function (options) {
    this.setData({
      goodsDetail: JSON.parse(options.data),
      userInfo: JSON.parse(options.userInfo)
    });
  },
  onShow: function() {
  },

  onClose: function() {
    this.setData({
      showDialog: false
    });
  },

  onSubmit: function() {
    const { goodsDetail, userInfo } = this.data;
    if(parseInt(goodsDetail.price) > parseInt(userInfo.v_amount || 0)) {
      this.setData({
        showDialog: true
      });
      return;
    }

    wx.navigateTo({
      url: '/pages/shop-submit/index?data=' + JSON.stringify(goodsDetail) + '&userInfo=' + JSON.stringify(userInfo)
    })
  }

})
