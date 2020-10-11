//index.js
const API = require('../../config/api.js');
const host = 'https://klxxcx.klart.cn'

Page({
  data: {
    height: 0,

    authCamera: false,
    params: {}
  },
  onLoad: function (options) {
    console.log(options);
    this.setData({
      params: JSON.parse(options.data)
    });
    try {
      const res = wx.getSystemInfoSync();
      let h = res.windowHeight - 230;
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
    wx.showLoading({
      title: '图片上传中...'
    });
    wx.uploadFile({
      url: host + '/api/upload/index',
      filePath: file,
      name: 'file',
      header:{
        "token": wx.getStorageSync('token'),
        "Content-Type": "multipart/form-data"
      },
      success: (res) => {
        const data = res.data;
        wx.hideLoading();
        this.toSubmit(data && JSON.parse(data || '{}'));

      },
      fail: () => {
        wx.hideLoading();
      }
    });
  },

  // 去提交作业页面
  toSubmit: function(imgsData) {
    let { params } = this.data; 

    let data = {
      ...params,
      img_url: imgsData && imgsData.data && imgsData.data.url
    };

    wx.navigateTo({
      url: `/pages/course-submit/index?data=${JSON.stringify(data)}`,
    });
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
