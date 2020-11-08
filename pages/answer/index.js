//index.js
const app = getApp()
const API = require('../../config/api.js');

Page({
  data: {
    firstAnswer: "",
    currentAction: "first",
    qaData: [],
    levelData: {
      1: '../../resource/answer/L1.png',
      2: '../../resource/answer/L2.png',
      3: '../../resource/answer/L3.png',
      4: '../../resource/answer/L4.png',
    }
  },
  onLoad: function (options) {
    
  },
  onShow: function() {
  },

  onLoaded: function() {
  },

  onError: function() {
  },

  getQa: function(data) {
    let { qaData } = this.data;
    let params = {
    };
    if(data) {
      params.qa_id = data.qaid
    }

    wx.showLoading({
      title: '获取下一题',
    });

    API.getQa(params).then(res => {//成功
      wx.hideLoading();
      let data = qaData.concat([res || {}])
      this.setData({
        qaData: data
      });
    }).catch(e => {
      wx.hideLoading()
    })
  },

  // 获取题目
  getMoreQa: function() {
    let { qaData } = this.data;
    if(qaData.length > 0) {
      this.getQa(qaData[qaData.length - 1])
    } else {
      this.getQa()
    }
  },

  onFirstClick: function(e) {
    const { answer } = e.currentTarget.dataset;

    this.setData({
      firstAnswer: answer,
    });
  },

  onCPClick: function() {
    this.setData({
      currentAction: 'second'
    });
    this.getMoreQa();
  },

  // 选择答案
  onSelectAns: function(e) {
    const { level, asid, qaid, answer } = e.currentTarget.dataset;
    let { qaData } = this.data;

    qaData[qaData.length - 1].asid = asid;
    qaData[qaData.length - 1].level = level;
    qaData[qaData.length - 1].answer = answer;
    qaData[qaData.length - 1].qaid = qaid;

    this.setData({
      qaData
    });

    if(qaid == 0 && level != 0) {
      // this.setData({
      //   currentAction: 'thrid'
      // });
    } else {
      setTimeout(() => {
        this.getMoreQa();
      }, 500);
    }
  },

  onThridClick: function() {
    this.setData({
      currentAction: 'thrid'
    });

    this.postCP();
  },

  onResetClick: function() {
    this.setData({
      firstAnswer: "",
      currentAction: "first",
      qaData: [],
    });
  },

  // 提交测评
  postCP: function() {
    let { qaData } = this.data;
    let params = {
      level: qaData[qaData.length - 1].level,
      json: JSON.stringify(qaData)
    };
    // let json = [];

    // qaData.forEach(item => {
    //   json.push({
    //     q
    //   })
    // })

    API.level(params).then(res => {//成功
      
    }).catch(e => {
    })
  }
})
