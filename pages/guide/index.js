//index.js

Page({
  data: {
  },
  onLoad: function () {
  },
  onShow: function() {
  },


  onShareAppMessage: function() {
    const { userInfo } = this.data;

    return {
      title: `考拉熊使用指南`,
      path: `/pages/guide/index`,
      //imageUrl: userInfo.head_img
    };
  }
})
