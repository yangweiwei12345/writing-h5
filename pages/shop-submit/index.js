//index.js
const util = require('../../utils/util');
const API = require('../../config/api.js');

Page({
  data: {
    goodsDetail: {},
    userInfo: {},

    name: '',
    phone: '',
    address: '',

    nameErrMsg: '',
    phoneErrMsg: '',
    addrErrMsg: ''
  },
  onLoad: function (options) {
    let goodsDetail = JSON.parse(options.data);
    let userInfo = JSON.parse(options.userInfo)
    this.setData({
      goodsDetail,
      userInfo,
      address: userInfo.address,
      phone: userInfo.phone
    });
  },
  onShow: function() {
  },

  onNameChange: function(e) {
    let value = e.detail;

    if(value.length === 0) {
      this.setData({
        nameErrMsg: '请输入姓名'
      });
      return false
    } else {
      this.setData({
        nameErrMsg: ''
      });
      return true
    }
  },

  onPhoneChange: function(e) {
    let value = e.detail;

    if(value.length === 0) {
      this.setData({
        phoneErrMsg: '请输入手机号'
      });
      return false
    } else if(!util.checkPhone(value)) {
      this.setData({
        phoneErrMsg: '手机号格式错误'
      });
      return false
    } else {
      this.setData({
        phoneErrMsg: ''
      });
      return true
    }
  },

  onAddrChange: function(e) {
    let value = e.detail;

    if(value.length === 0) {
      this.setData({
        addrErrMsg: '请输入地址'
      });
      return false
    } else {
      this.setData({
        phoneErrMsg: ''
      });
      return true
    }
  },

  onSubmit: function() {
    const { name, phone, address, goodsDetail } = this.data;

    if(!this.onNameChange({detail: name})) {
      return;
    }

    if(!this.onPhoneChange({detail: phone})) {
      return;
    }

    if(!this.onAddrChange({detail: address})) {
      return;
    }

    let params = {
      user_name: name,
      phone,
      address,
      goods_id: goodsDetail.goods_id
    };
    wx.showLoading({
      title: '订单创建中...',
    });

    API.create(params)
      .then(res => {
        wx.hideLoading();

        wx.showToast({
          title: '订单创建成功',
          icon: 'none'
        })
        

      })
      .catch(e => {

        wx.showToast({
          title: e || '订单创建失败',
          icon: 'none'
        });
        wx.hideLoading();
      })

  }

})
