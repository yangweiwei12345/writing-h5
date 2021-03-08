//index.js

Page({
  data: {
    contents:'15232300775',
    contentsts:'15267010876'
  },
  copyText: function (e) {
    wx.setClipboardData({
      data: e.currentTarget.dataset.text,
      success: function (res) {
        wx.getClipboardData({
          success: function (res) {
            wx.showToast({
              title: '复制成功'
            })
          }
        })
      }
    })
  },
  onLoad: function () {
  },
  onShow: function() {
  },


  onShareAppMessage: function() {
    const { userInfo } = this.data;

    return {
      title: `在线客服`,
      path: `/pages/guide/index`,
      //imageUrl: userInfo.head_img
    };
  }
})
