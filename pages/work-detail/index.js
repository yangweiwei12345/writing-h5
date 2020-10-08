//index.js
//获取应用实例
const API = require('../../config/api.js');
const rpx2px = require('../../utils/rpx2px.js');

var startDate;
var date;
var curTime;
var context = null;
var timer = null;

Page({
  data: {
    workDetail: {},
    work_id: '',
    hisDataArr: [],
    //录音内容
    audioValue: "",
    playStatus: 0, //播放状态 0:未播放,1:正在播放,2:暂停,3:播放结束

    innerAudioContext: null,

    // 进度条宽度
    progressW: 0
  },
  onLoad: function (options) {
    this.setData({
      work_id: options.work_id,
      innerAudioContext: wx.createInnerAudioContext()
    }, () => {
      this.getWorkDetail();
    });
  },
  onShow: function() {
    wx.getSystemInfo({
      success: (res) => {

        //瀑布流高度
        let ww = res.windowWidth;
        let wh = res.windowHeight;
        this.setData({
          ix: ww,
          iy: wh
        });
      }
    })
  },

   /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    context = wx.createCanvasContext('myCanvas');
    context.beginPath();
    context.setStrokeStyle('#000');
    context.setLineWidth(2);
    context.setLineCap('round');
    context.setLineJoin('round');

  },

  /**
   * 获取当前用户个人资料
   * @date 2020-09-14
   * @returns {any}
   */
  getWorkDetail: function () {

    API.workDetail({
      work_id: this.data.work_id
    }).then(res => {//成功
      this.setData({
        workDetail: res,
        hisDataArr: JSON.parse(res.draw || '[]'),
      });
      // 已点评
      if(res.status === 1) {
        this.initAudioContext(res.remark_vioce);
      }
    })
  },

  initAudioContext: function(src) {
    const { innerAudioContext } = this.data;

    // 已点评
    innerAudioContext.src = src;
    // innerAudioContext.onCanplay(() => {
    //   // setTimeout(() => {
    //     //延时获取音频真正的duration
    //   let duration = innerAudioContext.duration;
    //   console.log(duration);
      
    //   this.setData({ audioDuration: duration });
    //   // }, 1000)
    // })
    // 播放结束
    innerAudioContext.onEnded(() => {
      this.setData({
        playStatus: 0,
        progressW: 0
      });
      this.data.innerAudioContext.paused;
    });
    // 播放进度
    innerAudioContext.onTimeUpdate(() => {
      let duration = innerAudioContext.duration,
        currentTime = innerAudioContext.currentTime;

      this.setData({
        progressW: currentTime / duration * 100
      });
    });

  },

  play: function() {
    const { innerAudioContext } = this.data;

    this.setData({
      playStatus: 1
    });
    innerAudioContext.play();

    this.start();

    // 主动读取一次 this.data.innerAudioContext.paused，不然重新播放onTimeUpdate不执行
    setTimeout(() => {
      console.log(this.data.innerAudioContext.paused)
    }, 100)
  },

  replay: function() {
    const { innerAudioContext } = this.data;

    this.setData({
      playStatus: 1
    });
    innerAudioContext.play();

    this.restart();

  },

  pause: function() {
    const { innerAudioContext } = this.data;

    this.setData({
      playStatus: 2
    });
    innerAudioContext.pause();

    this.stop();
  },

  start:function(){
      context.clearRect(0, 0, this.data.ix * 0.9, this.data.iy * 0.85);//清除多大范围的画布
      clearInterval(timer);
      date = new Date();
      startDate = date.getTime();
      var i = 0;
      var that = this;
      var len = this.data.hisDataArr.length;

      if(len === 0) {
        return
      }
      timer = setInterval(function(){
        date = new Date();
        curTime = date.getTime() - startDate;
        //console.log("time is "+curTime);
        if (curTime >= that.data.hisDataArr[i].time){
          switch (that.data.hisDataArr[i].operation) {
            case "mapping":
              context.setStrokeStyle(that.data.hisDataArr[i].lineArr.colorStr);
              context.moveTo(that.data.hisDataArr[i].lineArr.startX , that.data.hisDataArr[i].lineArr.startY );
              context.lineTo(that.data.hisDataArr[i].lineArr.currentX , that.data.hisDataArr[i].lineArr.currentY );
              context.stroke();
              context.draw(true);
              break;
            case "clearCanvas":
              context.clearRect(0, 0, that.data.ix, that.data.iy);
              context.draw(true);
              break;
            case "clearLine":
              context.clearRect(that.data.hisDataArr[i].lineArr.currentX-12, that.data.hisDataArr[i].lineArr.currentY-12, 24, 24);
              context.draw(true);
              break;
            case "circle":
              context.setStrokeStyle(that.data.hisDataArr[i].lineArr.colorStr);
              if(that.data.hisDataArr[i].lineArr.colorStr == "red"){
                context.arc(that.data.hisDataArr[i].lineArr.startX *that.data.ix*.9, that.data.hisDataArr[i].lineArr.startY *that.data.iy , 13, 0, 2 * Math.PI);
              }else{
                context.arc(that.data.hisDataArr[i].lineArr.startX *that.data.ix*.9, that.data.hisDataArr[i].lineArr.startY *that.data.iy , 15, 0, 2 * Math.PI);
              }

              context.stroke();
              context.draw(true);
              break;
          }
          i++;
        }
        if(i >= len){
          clearInterval(timer);
        }
      },20);
  },

  // 正在播放1，转到暂停2
  stop: function() {
    clearInterval(timer);
    startDate = date.getTime();
    this.setData({
      pausetimes: startDate,
    });
    console.log("暂停了");
  },

  // 暂停2，转到播放1
  restart: function() {
    clearInterval(timer);
    date = new Date();
    startDate = date.getTime();

    var i = 0;
    var that = this;
    var len = this.data.hisDataArr.length;
    timer = setInterval(function(){
      date = new Date();
      curTime = date.getTime() - startDate;
      if (curTime >= that.data.hisDataArr[i].time){
        switch (that.data.hisDataArr[i].operation) {
          case "mapping":
            context.setStrokeStyle(that.data.hisDataArr[i].lineArr.colorStr);
            context.moveTo(that.data.hisDataArr[i].lineArr.startX , that.data.hisDataArr[i].lineArr.startY );
            context.lineTo(that.data.hisDataArr[i].lineArr.currentX , that.data.hisDataArr[i].lineArr.currentY );
            context.stroke();
            context.draw(true);
            break;
          case "clearCanvas":
            context.clearRect(0, 0, that.data.ix, that.data.iy);
            context.draw(true);
            break;
          case "clearLine":
            context.clearRect(that.data.hisDataArr[i].lineArr.currentX-12, that.data.hisDataArr[i].lineArr.currentY-12, 24, 24);
            context.draw(true);
            break;
          case "circle":
            context.setStrokeStyle(that.data.hisDataArr[i].lineArr.colorStr);
            if(that.data.hisDataArr[i].lineArr.colorStr == "red"){
              context.arc(that.data.hisDataArr[i].lineArr.startX *that.data.ix, that.data.hisDataArr[i].lineArr.startY *that.data.iy , 13, 0, 2 * Math.PI);
            }else{
              context.arc(that.data.hisDataArr[i].lineArr.startX *that.data.ix, that.data.hisDataArr[i].lineArr.startY *that.data.iy , 15, 0, 2 * Math.PI);
            }

            context.stroke();
            context.draw(true);
            break;
        }
        i++;
      }
      if(i >= len){
        clearInterval(timer);
      }
    },20);
    console.log("暂停又继续了 2-1");
  }


})
