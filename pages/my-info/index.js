//index.js
//获取应用实例
const API = require('../../config/api.js');

Page({
  data: {
    userInfo: {},
    sexs: [{text: '保密', value: 0}, {text: '男', value: '1'}, {text: '女', value: '2'}],
    ages: [],
    cls: ['一年级', '二年级', '三年级', '四年级', '五年级', '六年级'],

    head: '',
    nick_name: '',
    age: 0,
    sex: 0,
    user_class: '',
    phone: '',
    address: ''
  },
  onLoad: function () {
    let ages = []
    for(let i = 0; i <= 15; i++) {
      ages.push(i + '');
    }
    this.setData({
      ages
    });
  },
  onShow: function() {
    this.getInfoData();
  },

  /**
   * 获取当前用户个人资料
   * @date 2020-09-14
   * @returns {any}
   */
  getInfoData: function () {
    API.getUserInfo({
    }).then(res => {//成功
      this.setData({
        userInfo: res,
      });
      const { nick_name, age, sex, user_class, phone, address, head_img } = res || {};
      this.setData({
        nick_name, age, sex, phone, address,
        head: head_img,
        user_class: user_class ? user_class : this.data.cls[0]
      });
    })
  },

  // 修改信息
  editUser: function(e) {
    const { name } = e.currentTarget.dataset;
    let params = this.getParams(name);

    API.editUserInfo(params).then(res => {//成功
      this.setData({
        showName: false,
        showSex: false,
        showAge: false,
        showClass: false,
        showPhone: false,
        showAddr: false
      });
      this.getInfoData();
    })
  },

  // 上传头像
  uploadHead: function() {
    wx.chooseImage({ 
      count: 1,
      sizeType: ['original'],
      sourceType: ['album', 'camera'], 
      success: (res) => {
        if(res && res.errMsg == "chooseImage:ok") {
          this.uploadImage(res.tempFilePaths[0]);
        }
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
        "Content-Type": "multipart/form-data"
      },
      success: (res) => {
        const data = res.data;
        this.setData({
          head: JSON.parse(data || '{}').data.url
        }, () => {
          this.editUser({
            currentTarget: {
              dataset: {
                name: 'head'
              }
            }
          })
        });
      }
    });
  },

  getParams: function(name) {
    switch(name) {
      case 'nick_name': 
        return {
          edit_key: 'NICK_NAME',
          edit_val: this.data.nick_name
        };
      case 'sex': 
        return {
          edit_key: 'SEX',
          edit_val: this.data.sex
        };
      case 'age': 
        return {
          edit_key: 'AGE',
          edit_val: this.data.age
        };
      case 'class': 
        return {
          edit_key: 'USER_CLASS',
          edit_val: this.data.user_class
        };
      case 'phone': 
        return {
          edit_key: 'PHONE',
          edit_val: this.data.phone
        };
      case 'address': 
        return {
          edit_key: 'ADDRESS',
          edit_val: this.data.address
        };
      case 'head': 
        return {
          edit_key: 'HEAD',
          edit_val: this.data.head
        };
    }
  },

  onSexChange: function(e) {
    const { picker, value, index } = e.detail;
    console.log(value, index)
    this.setData({
      sex: value.value
    });
  },
  onAgeChange: function(e) {
    console.log(e.detail);
    const { value } = e.detail;
    this.setData({
      age: value
    });
  },
  onClassChange: function(e) {
    const { value } = e.detail;
    this.setData({
      user_class: value
    });
  },

  onNameVisible: function() {
    this.setData({
      showName: !this.data.showName
    });
  },

  onSexVisible: function() {
    this.setData({
      showSex: !this.data.showSex
    });
  },

  onAgeVisible: function() {
    this.setData({
      showAge: !this.data.showAge
    });
  },

  onClassVisible: function() {
    this.setData({
      showClass: !this.data.showClass
    });
  },

  onPhoneVisible: function() {
    this.setData({
      showPhone: !this.data.showPhone
    });
  },

  onAddrVisible: function() {
    this.setData({
      showAddr: !this.data.showAddr
    });
  }

})
