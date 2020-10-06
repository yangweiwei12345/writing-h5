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
                  const { token } = res;
                  wx.setStorage({
                    key: "token",
                    data: token
                  });
                  that.getUserInfoDetail();

                  that.setData({
                    wxlogin: true
                  });
                  
                })
            }
          });

        }
      })
    }
  }
});