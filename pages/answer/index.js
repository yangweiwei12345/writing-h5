//index.js
const app = getApp()
const API = require('../../config/api.js');
const Auth = require('../../utils/auth');

Page({
  data: {
    wxlogin: true,
    userInfo: {},

    firstAnswer: "",
    currentAction: "first",
    qaData: [],
    levelData: {
      1: 'http://cdn.koalaxiezi.com/Writing/answer/L1.png',
      2: 'http://cdn.koalaxiezi.com/Writing/answer/L2.png',
      3: 'http://cdn.koalaxiezi.com/Writing/answer/L3.png',
      4: 'http://cdn.koalaxiezi.com/Writing/answer/L4.png',
    },
    // 评语
    pyData: {
      1: ['宝贝需要开始书法启蒙课，多学习笔画的运用，独体字的书写'],
      2: ['宝贝拥有一定的控笔能力，用心学习，一定有所进步'],
      3: ['宝贝具有一定的书法基础，结构上大部分字书写准确'],
      4: ['宝贝书写规范，结构准确']
    },
    // 能力分析
    nlData: {
      1: ['需要学习每种笔画的特点'],
      2: ['对笔画的运用有一定了解，结构书写上会有不足的地方，需要学习'],
      3: ['需要进行结构规律的学习，达到举一反三的能力'],
      4: ['需要进行系统结构规律的总结性练习以及章法的练习']
    },
    level: 0,
    isFinish: false
  },
  onLoad: function (options) {
    let level = options.level;
    console.log(level);
    if(level && level != 0) {
      this.setData({
        level,
        currentAction: 'thrid'
      });
    }
  },
  onShow: function() {
    this.isLogin();
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
    if(!this.data.wxlogin) {
      this.setData({
        wxlogin: false
      });
      return;
    }

    this.setData({
      currentAction: 'second',
      level: 0
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

    if(this.data.level === 0) {
      this.setData({
        level
      });
    }

    if(qaid == 0 && level != 0) {
      // this.setData({
      //   currentAction: 'thrid'
      // });
    } else {
      this.getMoreQa();
    }
  },

  onThridClick: function() {
    this.setData({
      currentAction: 'thrid'
    });

    wx.showLoading({
      title: '评测中'
    })
    setTimeout(() => {
      wx.hideLoading();
    }, 2000);

    this.postCP();
  },

  onResetClick: function() {
    this.setData({
      firstAnswer: "",
      currentAction: "first",
      qaData: [],
      level: 0
    });
  },

  // 提交测评
  postCP: function() {
    let { qaData } = this.data;
    let params = {
      level: this.data.level,
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
  },
  
  onShareAppMessage: function() {
    const { userInfo } = this.data;

    return {
      title: `考拉熊智能评测`,
      path: `/pages/answer/index`,
      //imageUrl: userInfo.head_img
    };
  },


  // 是否登录
  isLogin: function() {
    // 是否登录
    Auth.checkHasLogined()
      .then(res => {
        if(res) {
          this.setData({
            wxlogin: true
          }, () => {
            // 用户登录之后查看当前个人资料是否填写
            this.getInfoData()
          });
        } else {
          this.setData({
            wxlogin: false
          });
        }
      }).catch(e => {
        this.setData({
          wxlogin: false
        });
      })
  },

  /**
   * 获取当前用户个人资料
   * @date 2020-09-14
   * @returns {any}
   */
  getInfoData: function () {
    wx.showLoading({
      title: '请求中...',
    });
    API.getUserInfo({
    }).then(res => {//成功
      this.setData({
        userInfo: res,
      })
      wx.hideLoading();
    }).catch(e => {
      wx.hideLoading();
    })
  },

  getUserInfoDetail: function() {
    this.setData({
      wxlogin: true
    });
    this.getInfoData();
  },
})
