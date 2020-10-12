const API = require('../../config/api');

Component({
  properties: {
    wxlogin: {
      type: Boolean
    }
  },

  data: {
    // 默认已登陆
    wxlogin: true
  },

  methods: {
    // 取消登录
    cancelLogin: function() {
      this.setData({
        wxlogin: true
      });
    },

    getUserInfoDetail() {
      this.triggerEvent('getUserInfoDetail', {})
    },

    onGotUserInfo: function (e) {
      if(e.detail.errMsg == 'getUserInfo:ok') {
        this.login(e);
      } else {
        // wx.showToast({
        //   title: e.detail.errMsg || '获取信息失败',
        // })
      }
    },

    toLoad: function() {
      wx.showLoading({
        title: '登录中...',
      });
    },

    // 登录
    login: function(data) {
      let that = this;
      wx.login({
        success: res => {
          let code = res.code;

          wx.getUserInfo({
            success: function (data) {
              let { encryptedData, rawData, signature, iv } = data;
              let params = {
                code: encodeURIComponent(code),
                encryptedData: encodeURIComponent(encryptedData),
                rawData: encodeURIComponent(rawData),
                signature: encodeURIComponent(signature),
                iv: encodeURIComponent(iv)
              };

              // var userId = wx.getStorageSync('userId');
              // if(userId) {
              //   params.superior_id = userId;
              // }

              API.login(params)
                .then(res => {
                  try {
                    wx.hideLoading();
                  } catch(e) {}
                  const { token } = res;
                  try {
                    wx.setStorageSync("token", token);
                    that.getUserInfoDetail();

                    that.setData({
                      wxlogin: true
                    });
                  }catch(e) {
                    wx.showToast({
                      title: '登录失败',
                      icon: 'none'
                    })
                  }
                  
                })
                .catch(err => {
                  try {
                    wx.hideLoading();
                  } catch(e) {}
                  wx.showToast({
                    title: '登录失败',
                    icon: 'none'
                  })
                  that.setData({
                    wxlogin: true
                  });
                })
            }
          });

        },
        fail: res => {
          wx.showToast({
            title: '获取用户信息失败',
            icon: 'none'
          })
          that.setData({
            wxlogin: true
          });
          try {
            wx.hideLoading();
          } catch(e) {}

        }
      })
    }
  }
});