//index.js
const API = require('../../config/api.js');

Page({
  data: {
    height: 0,

    authCamera: false,
    params: {}
  },
  onLoad: function (options) {
    console.log(options);
    this.setData({
      params: options
    });
    try {
      const res = wx.getSystemInfoSync();
      let h = res.windowHeight - 200;
      this.setData({
        height: h
      });
    } catch (e) {
    }
  },
  onShow: function() {
    wx.getSetting({  
      success: (res) => {  
        console.log(res);
        if (res.authSetting["scope.camera"]) {  
          this.setData({  
            authCamera:true,  
          })  
        } else {  
          this.setData({  
            authCamera:false,  
          })  
        }  
      }  
    });  
  },
  // 拍照
  takePhoto: function() {
    const ctx = wx.createCameraContext()
    ctx.takePhoto({
      quality: 'high',
      success: (res) => {
        this.setData({
          src: res.tempImagePath
        })
        this.uploadImage(res.tempImagePath);
      }
    })
  },

  // 相册
  onChoosePhoto: function() {
    wx.chooseImage({ 
      count: 1,
      sizeType: ['original'],
      sourceType: ['album'], 
      success: (res) => {
        console.log(res)
      }
    });
  },

  // 上传图片
  uploadImage: function(file) {
    wx.uploadFile({
      url: 'http://xz-api.defengvip.com/api/upload/index',
      filePath: file,
      name: 'file',
      header:{
        "token": wx.getStorageSync('token'),
        "Content-Type": "multipart/form-data;boundary=ABCD"
      },
      success (res){
        const data = res.data
        console.log(res);
      }
    })
    API.upload({
      file
    }, {
      "Content-Type": "multipart/form-data; boundary=ABCD"
    })
  },

  handleCameraError:function() {  
    wx.showToast({  
      title:'用户拒绝使用摄像头',  
      icon: 'none'  
    })  
  },
  
  error(e) {
    console.log(e.detail)
  }
})
