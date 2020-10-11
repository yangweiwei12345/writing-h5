//index.js
//获取应用实例
const API = require('../../config/api.js');
const rpx2px = require('../../utils/rpx2px.js');
const host = 'https://klxxcx.klart.cn'

var moveToX = 0, moveToY = 0, lineToX = 0, lineToY = 0;
var context = null;
var isStart = false;
var date;
var startDate;//开始时刻
var penType = "drawPen";
var colorStr = "#000";
var operationType = "mapping";
var time = 2;   // 录音时长（分钟）
var secondes = 0;
var timer = null;
let scrollTop = 0;
let t = null;

Page({
  data: {
    userInfo: {},
    workDetail: {},
    params: {},

    audioValue: "", //录音内容
    audioValueUrl: '',  // 上传录音之后地址
    duration: 0, //录音时长
    recodeStatus: 0, //录音状态 0:未录音,1:正在录音2:录音完成
    playStatus: 0, //播放状态 0:未播放,1:正在播放
    recoderAuthStatus: false, //录音授权状态

    hisDataArr:[
      {
        time:0,//操作时间
        /**
         * 操作类型
         * 绘图：mapping
         * 拖动球员：moveplayer
         * 清除画布：clearCanvas
         * 橡皮擦：clearLine
         * 画圈：circle
         */
        operation:"mapping",//操作类型
        /**
         * 绘制路径
         * startX：开始x坐标
         * startY：开y纵坐标
         * currentX：目标位置的 x 坐标
         * currentY：目标位置的 y 坐标
         * z：1代表画线时鼠标处于move状态，0代表处于松开状态
         * colorStr：线的填充颜色
         * r:圆的半径
         * sAngle:起始弧度，单位弧度（在3点钟方向）
         * eAngle:终止弧度
         */
        lineArr: {    //绘制路径
          startX:0,
          startY:0,
          currentX:0,
          currentY:0,
          z:0,
          colorStr:"#000",
         
        }
      }
    ],

    time: time,
    readyTime: '00:00',   // 已录音时长

    // 是否展示画笔
    isCircleShow: false,

    // 是否上榜
    isRank: false,

    // 防止送花快速点击
    isFly: false,
    flowerCount: 0,
    remark: '',

    showGif: false,

    // 图片是否加载完成
    imgLoaded: false,
    width: 0,
    height: 0,

    // 是否已点评
    isFinished: false,
    key: 0
  },
  onLoad: function (options) {
    const res = wx.getSystemInfoSync();
    console.log(res);
    this.setData({
      ix: res.screenWidth,
      iy: res.screenHeight,
      sw: res.screenWidth,
      sh: res.screenHeight,
      params: options
    }, () => {
      this.getUserInfo()
      this.getWorkDetail();
    });
    // wx.getSystemInfo({
    //   success: (res) => {
    //     //导航栏高度
    //     //瀑布流高度
    //     let ww = res.windowWidth;
    //     let wh = res.windowHeight;
        
    //     this.setData({
    //      sw: ww,
    //      sh: wh,
    //     });
    //   }
    // })
    //判断是否已授权录音权限
    this.getAuthSetting();
    // 初始化音频管理器
    this.initRecorderManager();
    // 初始化canvas
    this.initCanvas();
  },
  onShow: function() {
  },

  onUnload: function() {
    timer && clearTimeout(timer);

    context = null;
    isStart = false;
    date;
    startDate;//开始时刻
    penType = "drawPen";
    colorStr = "#000";
    operationType = "mapping";
    secondes = 0;

    this.closeRecorder = true;
    this.recorderManager.stop();
  },

  // 图片加载完成
  imgLoad: function(e) {
    // const { width, height } = e.detail;
    // const { ix, iy } = this.data;
    // let h = (iy - rpx2px(360));
    // // let w = (ix - rpx2px(108)) * .8;
    // // let h = w * height / width;
    // let w = h * width / height;

    // this.setData({
    //   imgLoaded: true,
    //   width: w,
    //   height: h
    // });

    const { width, height } = e.detail;
    const { ix, iy } = this.data;
    let maxWidth = ix - rpx2px(56);
    // let h = (iy - rpx2px(480));
    let h = iy / 2;
    let w = h * width / height;
    console.log(iy, h, maxWidth, w)

    if(maxWidth < w) {
      w = maxWidth;
      h = w * height / width;
    }

    this.setData({
      imgLoaded: true,
      width: w,
      height: h
    });

  },

  // 获取当前用户信息
  getUserInfo: function () {
    API.otherInfo({
      user_id: this.data.params.user_id
    }).then(res => {//成功
      this.setData({
        userInfo: res || {},
      })
    })
  },

  // 获取作业信息
  getWorkDetail: function() {
    API.workDetail({
      work_id: this.data.params.work_id
    }).then(res => {//成功
      this.setData({
        workDetail: res || {},
        isFinished: (res || {}).status === 1
      })
    })
  },

  //获取权限设置
  getAuthSetting() {
    wx.getSetting({
      success: (res) => {
        if (!res.authSetting["scope.record"]) {
          wx.authorize({
            scope: "scope.record",
            success: () => {
              this.setData({
                recoderAuthStatus: true
              });
            },
            fail: () => {
              this.setData({
                recoderAuthStatus: false
              });
            }
          });
        } else {
          this.setData({
            recoderAuthStatus: true
          });
        }
      }
    });
  },
  
  //初始化音频管理器
  initRecorderManager() {
    const recorderManager = wx.getRecorderManager();
    recorderManager.onError(() => {});
    recorderManager.onStart(() => {
      this.countdown();//开始计时
    });
    //结束播放语音
    recorderManager.onStop(res => {
      console.log(this.closeRecorder);
      if(this.closeRecorder) {
        this.closeRecorder = false;
        return;
      }
      const duration = this.fmtRecoderTime(res.duration); //获取录音时长
      //小程序录音最长2分钟(120秒)
      if (duration >= time * 60) {
        // this.tip('录音时间不能超过120"');
        this.setData({
          recodeStatus: 2 //结束
        })
      } else if (duration < 1) {
        this.setData({
          recodeStatus: 0,
        })
        return;
      } else {
        this.setData({
          recodeStatus: 2 //结束
        })
      }
      this.setData({
        duration: duration,
        audioValue: res.tempFilePath,
        isStart: false
      })
      timer && clearTimeout(timer);

    });
    this.recorderManager = recorderManager;

    //创建内部 audio 上下文 InnerAudioContext 对象。
    const innerAudioContext = wx.createInnerAudioContext();
    //监听音频自然播放至结束的事件
    innerAudioContext.onEnded(() => {
      //音频自然播放至结束的事件的回调函数
      this.setData({
        playStatus:0//播放状态重置为未开始
      })
    });
    innerAudioContext.onError(res => {});
    this.innerAudioContext = innerAudioContext;
  },

  // 初始化canvas
  initCanvas() {
    //初始化画布
    isStart = false;
    context = wx.createCanvasContext('myCanvas');
    context.beginPath();
    context.setStrokeStyle('#000');
    context.setLineWidth(2);
    context.setLineCap('round');
    context.setLineJoin('round');
  },

  //开始录音
  startRecorder() {
    if (this.data.recoderAuthStatus) {
      this.recorderManagerStart();
      this.startRecording();
    } else {
      wx.openSetting({
        success: (res) => {
          if (res.authSetting["scope.record"]) {
            this.setData({
              recoderAuthStatus: true
            });
            this.recorderManagerStart();
            this.startRecording();
          } else {
            wx.showToast({
              title: '请授权录音功能',
              icon: 'none'
            })
          }
        }
      });
    }
  },

  // 停止录音
  stopRecorder: function() {
    this.recorderManager.stop();
  },

  // 调用录音能力
  recorderManagerStart() {
    this.recorderManager.start({
      format: "mp3",
      duration: 10000 * 6 * time
    });
    this.setData({
      recodeStatus: 1
    })
  },

  //开始录制绘画
  startRecording:function(){
    isStart = true;
    date = new Date();
    startDate = date.getTime();
  },
  
  canvasStart:function(e){
    if(!isStart) {
      wx.showToast({
        title: '开始录音才能画重点',
        icon: 'none'
      })
      return;
    }
    var x = Math.floor(e.touches[0].clientX);
    var y = Math.floor(e.touches[0].clientY);
    date = new Date();

    console.log(this.data.sw, this.data.sh)
    let offsetX = (this.data.sw - this.data.width) / 2;
    let offsetY = rpx2px(280) - scrollTop;
    moveToX = x - offsetX;
    moveToY = y - offsetY;
    operationType = "mapping";
    if(penType === "clearPen"){
      operationType = "clearLine";
    }else if(penType === "circle"){
      operationType = "circle";
      if(colorStr == "red"){
        context.setStrokeStyle(colorStr);
        context.arc(moveToX, moveToY, 13, 0, 2 * Math.PI);
        context.stroke();
        context.draw(true);
        // console.log("is draw movew x y is"+moveToX+" "+moveToY);
      }else{
        context.setStrokeStyle(colorStr);
        context.arc(moveToX, moveToY, 15, 0, 2 * Math.PI);
        context.stroke();
        context.draw(true);
        // console.log("is draw movew x y is"+moveToX+" "+moveToY);
      }
    }
    if (isStart) {
      this.data.hisDataArr.push({
        time: date.getTime() - startDate,
        operation: operationType,
        lineArr: {
          startX: moveToX/this.data.width,
          startY: moveToY/this.data.height,
          currentX: moveToX,
          currentY: moveToY,
          z: 1,
          colorStr:colorStr,
          
        }
      })
      console.log(JSON.stringify(this.data.hisDataArr));
    }
  },

  //会上传录音
  uploadVideo:function(){
    console.log(this.data.audioValue);
    if(!this.data.audioValue) {
      wx.showToast({
        title: '请先录音，再上传',
        icon: 'none'
      })
      return
    }

    wx.showLoading({
      title: '录音上传中...',
    });
    
    // 上传图片
    wx.uploadFile({
      url: host + '/api/upload/index',
      filePath: this.data.audioValue,
      name: 'file',
      header:{
        "token": wx.getStorageSync('token'),
        "Content-Type": "multipart/form-data"
      },
      formData: {
        type: 'mp3'
      },
      success: (res) => {
        console.log(res);
        const data = res.data;
        this.setData({
          audioValueUrl: JSON.parse(data || '{}').data.url
        });
        wx.hideLoading();
        wx.showToast({
          title: "已上传录音文件",
          icon: "none"
        });
      },
      fail: function(err) {
        wx.hideLoading();
        wx.showToast({
          title: "网络状态不好请重新尝试",
          icon: "none"
        });
       
      },
      complete: function() {
        wx.hideLoading();
      }
    });
  },

  // 重置所有录音
  onResetAll: function() {
    isStart = false;
    penType = "drawPen";
    colorStr = "#000";
    operationType = "mapping";
    secondes = 0;

    this.setData({
      audioValue: "", //录音内容
      audioValueUrl: '',
      duration: 0, //录音时长
      recodeStatus: 0, //录音状态 0:未录音,1:正在录音2:录音完成
      playStatus: 0, //播放状态 0:未播放,1:正在播放
      recoderAuthStatus: false, //录音授权状态
      key: Math.random(),

      hisDataArr:[
        {
          time:0,//操作时间
          /**
           * 操作类型
           * 绘图：mapping
           * 拖动球员：moveplayer
           * 清除画布：clearCanvas
           * 橡皮擦：clearLine
           * 画圈：circle
           */
          operation:"mapping",//操作类型
          /**
           * 绘制路径
           * startX：开始x坐标
           * startY：开y纵坐标
           * currentX：目标位置的 x 坐标
           * currentY：目标位置的 y 坐标
           * z：1代表画线时鼠标处于move状态，0代表处于松开状态
           * colorStr：线的填充颜色
           * r:圆的半径
           * sAngle:起始弧度，单位弧度（在3点钟方向）
           * eAngle:终止弧度
           */
          lineArr: {    //绘制路径
            startX:0,
            startY:0,
            currentX:0,
            currentY:0,
            z:0,
            colorStr:"#000",
          
          }
        }
      ],

      readyTime: '00:00',   // 已录音时长

      // 是否展示画笔
      isCircleShow: false,

      // 防止送花快速点击
      isFly: false,
      flowerCount: 0
    }, () => {
      //判断是否已授权录音权限
      this.getAuthSetting();
      // 初始化音频管理器
      this.initRecorderManager();
      // 初始化canvas
      this.initCanvas();
    });
    this.casFlowerCount();

    // 关闭录音
    this.closeRecorder = true;
    this.recorderManager.stop();

    timer && clearTimeout(timer);

    context.clearRect(0, 0, this.data.ix, this.data.iy);//清除多大范围的画布
    context.draw()

  },

  // 计时器
  countdown: function() {
    timer = setInterval(() => {
      secondes++;
      
      if(secondes > time * 60){
        this.recorderManager.stop();
        timer && clearTimeout(timer);
      }
      
      this.setData({
        readyTime: this.formatSeconds(secondes)
      });
    }, 1000);
  },

  // 播放录音
  //播放录音
  playVoice() {
    if (this.data.playStatus == 0) {
      //未播放状态则点击播放
      if (!this.data.audioValue) {
        wx.showToast({
          title: '请先录音',
          icon: 'none'
        })
        return;
      }
      this.setData({
        playStatus: 1
      })
      this.innerAudioContext.src = this.data.audioValue;
      this.innerAudioContext.play();
    } else {
      //正在播放状态,则点击暂停
      this.setData({
        playStatus: 0
      })
      this.innerAudioContext.stop();
    }
  },

  formatSeconds: function(value) {
    var secondTime = parseInt(value); // 秒
    var minuteTime = 0; // 分
    var hourTime = 0; // 小时
    
    if (secondTime > 60) { //如果秒数大于60，将秒数转换成整数
      //获取分钟，除以60取整数，得到整数分钟
      minuteTime = parseInt(secondTime / 60);
      
      //获取秒数，秒数取佘，得到整数秒数
      secondTime = parseInt(secondTime % 60);
      
      //如果分钟大于60，将分钟转换成小时
      if (minuteTime > 60) {
        //获取小时，获取分钟除以60，得到整数小时
        hourTime = parseInt(minuteTime / 60);
        
        //获取小时后取佘的分，获取分钟除以60取佘的分
        minuteTime = parseInt(minuteTime % 60);
      
      }
    
    }
    
    var result;
    
    //时间的展示方式为00:00
    if(secondTime<10) {
      result = "0" + parseInt(secondTime);
    } else {
      result = "" + parseInt(secondTime);
    }
    
    if (minuteTime > 0) {
      if (minuteTime<10){
        result = "0" + parseInt(minuteTime) + ":" + result;
      } else {
        result = "" + parseInt(minuteTime) + ":" + result;
      }
    } else {
      result = "00:" + result;
    }
    
    //由于限制时长最多为三分钟,小时用不到
    if (hourTime > 0) {
      result = "" + parseInt(hourTime) + ":" + result;
    }
    
    return result;
    
  },

  //格式化录音时间
  fmtRecoderTime(duration = 0) {
    duration = duration / 1000;
    const seconds = duration.toString().split(".")[0]; //取秒
    return seconds;
  },
    
  //绿圈
  greenCircle: function () {
    colorStr = "green";
    penType = "circle";
    this.onShowCircle();
  },

  //红圈
  redCircle: function () {
    colorStr = "red";
    penType = "circle";
    this.onShowCircle();
  },

  onShowCircle: function() {
    this.setData({
      isCircleShow: !this.data.isCircleShow
    });
  },

  // 送花
  onSH: function (events) {
    if(!isStart) {
      wx.showToast({
        title: '开始录音才能送花',
        icon: 'none'
      })
      return;
    }

    //防止快速点击
    if (this.data.isFly) {
      return;
    }
    this._flyToCartEffect(events);

    let date = new Date();
    this.data.hisDataArr.push({
      time: date.getTime() - startDate,
      operation: "flower",
    });
    this.casFlowerCount();
  },

  // 计算花的数量
  casFlowerCount: function() {
    let flowerCount = 0;
    this.data.hisDataArr.forEach(item => {
      if(item.operation === 'flower') {
        flowerCount++;
      }
    })

    this.setData({
      flowerCount
    });
  },

  // 送花动效
  _flyToCartEffect: function (events) {
    //获得当前点击的位置，距离可视区域左上角
    var touches = events.touches[0];
    var diff = {
      x: '25px',
      y: '50px'
    },
    style = 'display: block;-webkit-transform:translate(' + diff.x + ',' + diff.y + ') rotate(350deg) scale(0)';  //移动距离
    this.setData({
      isFly: true,
      translateStyle: style
    });
    var that = this;
    setTimeout(() => {
      that.setData({
        isFly: false,
        translateStyle: '-webkit-transform: none;',  //恢复到最初状态
        isShake: true,
      });
      setTimeout(() => {
        that.setData({
          isShake: false,
        });
      }, 1000);
    }, 500);
  },

  // 上榜
  onRank: function() {
    this.setData({
      isRank: !this.data.isRank
    });
  },

  onShowGif: function() {
    if(!isStart) {
      wx.showToast({
        title: '开始录音才能展示GIF',
        icon: 'none'
      })
      return;
    }
    this.setData({
      showGif: !this.data.showGif
    }, () => {
      let date = new Date();
      this.data.hisDataArr.push({
        time: date.getTime() - startDate,
        operation: "gif",
        isShow: this.data.showGif
      });
    });
  },

  onPageScroll: function (e) {
    t && clearTimeout(t);
    t = setTimeout(() => {
      scrollTop = e.scrollTop;
    }, 300);
  },

  // 提交
  onSubmit: function() {
    const { params, hisDataArr, audioValueUrl, remark, isRank } = this.data;

    if(!audioValueUrl) {
      wx.showToast({
        title: '请先上传录音',
        icon: 'none'
      })
      return
    }

    let data = {
      work_id: params.work_id,
      draw: JSON.stringify(hisDataArr),
      remark_vioce: audioValueUrl,
      remark,
      is_ranking: isRank ? 1 : 0,
    };

    wx.showLoading({
      title: '正在提交...',
    });
    API.remarkWork(data)
      .then(res => {
        wx.showToast({
          title: '提交成功',
        });
        var pages = getCurrentPages();
        var prevPage = pages[pages.length - 2]; //上一个页面
        prevPage.onSelectPended();
        wx.navigateBack({
          delta: 1
        });
        wx.hideLoading()
      })
      // .fail(e => {
      //   wx.showToast({
      //     title: '提交失败',
      //     icon: ''
      //   })
      //   wx.hideLoading()
      // })
  },

  onEditJudge: function() {
    this.setData({
      isFinished: false
    });
  }
})
