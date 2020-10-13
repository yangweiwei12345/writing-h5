//index.js
//获取应用实例
const app = getApp()
const API = require('../../config/api.js');
const rpx2px = require('../../utils/rpx2px.js');
const Auth = require('../../utils/auth');

var startDate;
var date;
var curTime;
var context = null;
var timer = null;

// 总时长

Page({
  data: {
    statusBarHeight: app.globalData.statusBarHeight,

    workDetail: {},
    work_id: '',
    hisDataArr: [],

    //录音内容
    audioValue: "",
    playStatus: 0, //播放状态 0:未播放,1:正在播放,2:暂停,3:播放结束

    innerAudioContext: null,

    // 进度条宽度
    progressW: 0,
    showGif: false,

    // 图片是否加载完成
    imgLoaded: false,
    width: 0,
    height: 0,

    huaCount: 0,
    wxlogin: true,

    share: false

  },
  // 音频总时长
  duration: 0,
  // 动作总时长
  actionDuration: 0,

  onLoad: function (options) {
    const res = wx.getSystemInfoSync();
    this.setData({
      ix: res.screenWidth,
      iy: res.screenHeight,
      work_id: options.work_id,
      share: options.share,
      innerAudioContext: wx.createInnerAudioContext()
    }, () => {
      this.getWorkDetail();
    });
  },
  onShow: function() {
    // wx.getSystemInfoSync({
    //   success: (res) => {

    //     //瀑布流高度
    //     let ww = res.windowWidth;
    //     let wh = res.windowHeight;
    //     this.setData({
    //       ix: ww,
    //       iy: wh
    //     });
    //   }
    // })
    this.isLogin();
  },

  // 是否登录
  isLogin: function() {
    // 是否登录getUserInfoDetail
    Auth.checkHasLogined()
      .then(res => {
        if(res) {
          this.wxlogin = true
        } else {
          this.wxlogin = false
        }
      }).catch(e => {
        this.wxlogin = false
      })
  },

  getUserInfoDetail: function() {
    this.wxlogin = true;
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

  onUnload: function() {
    this.data.innerAudioContext.stop();
    this.data.innerAudioContext.destroy()
  },

  goBack: function() {
    wx.navigateBack({
      delta: 1
    });
  },

  goHome: function() {
    wx.switchTab({
      url: '/pages/index/index'
    });
  },

  // 图片加载完成
  imgLoad: function(e) {
    // const { width, height } = e.detail;
    // const { ix } = this.data;
    // let w = (ix - rpx2px(108)) * .8;
    // let h = w * height / width;
    // this.setData({
    //   imgLoaded: true,
    //   width: w,
    //   height: h
    // });

    const { width, height } = e.detail;
    const { ix, iy } = this.data;
    let maxWidth = ix - rpx2px(150);
    let h = (iy - rpx2px(600));
    let w = h * width / height;

    if(maxWidth < w) {
      w = maxWidth;
      h = w * height / width;
    }
    
    // let w = (ix - rpx2px(108)) * .8;
    // let h = w * height / width;

    this.setData({
      imgLoaded: true,
      width: w,
      height: h
    });
  },

  getWorkDetail: function () {

    API.workDetail({
      work_id: this.data.work_id
    }).then(res => {//成功
      let hisDataArrData = JSON.parse(res.draw || '[]');
      // hisDataArrData.push({
      //   time: 32476.143,
      //   operation: 'gif',
      //   isShow: true
      // });

      // hisDataArrData.push({
      //   time: 50000.143,
      //   operation: 'gif',
      //   isShow: false
      // });
      // let hisDataArrData = JSON.parse('[{"time":0,"operation":"mapping","lineArr":{"startX":0,"startY":0,"currentX":0,"currentY":0,"z":0,"colorStr":"#000"}},{"time":5716,"operation":"circle","lineArr":{"startX":0.43803098450774614,"startY":0.4917541229385307,"currentX":109.5625,"currentY":164,"z":1,"colorStr":"green"}},{"time":8286,"operation":"circle","lineArr":{"startX":0.6779110444777611,"startY":0.4707646176911544,"currentX":169.5625,"currentY":157,"z":1,"colorStr":"green"}},{"time":10244,"operation":"circle","lineArr":{"startX":0.6739130434782609,"startY":0.29985007496251875,"currentX":168.5625,"currentY":100,"z":1,"colorStr":"green"}},{"time":12132,"operation":"circle","lineArr":{"startX":0.7738630684657671,"startY":0.3058470764617691,"currentX":193.5625,"currentY":102,"z":1,"colorStr":"green"}},{"time":17490,"operation":"circle","lineArr":{"startX":0.4420289855072464,"startY":0.6536731634182908,"currentX":110.5625,"currentY":218,"z":1,"colorStr":"red"}},{"time":19297,"operation":"circle","lineArr":{"startX":0.6779110444777611,"startY":0.6416791604197901,"currentX":169.5625,"currentY":214,"z":1,"colorStr":"red"}},{"time":22087,"operation":"circle","lineArr":{"startX":0.43803098450774614,"startY":0.3028485757121439,"currentX":109.5625,"currentY":101,"z":1,"colorStr":"red"}},{"time":23937,"operation":"circle","lineArr":{"startX":0.5539730134932533,"startY":0.12593703148425786,"currentX":138.5625,"currentY":42,"z":1,"colorStr":"red"}},{"time":27443,"operation":"circle","lineArr":{"startX":0.25412293853073464,"startY":0.07196401799100449,"currentX":63.5625,"currentY":24,"z":1,"colorStr":"red"}},{"time":29709,"operation":"circle","lineArr":{"startX":0.19815092453773114,"startY":0.7406296851574213,"currentX":49.5625,"currentY":247,"z":1,"colorStr":"red"}},{"time":34973,"operation":"circle","lineArr":{"startX":0.4300349825087456,"startY":0.8545727136431784,"currentX":107.5625,"currentY":285,"z":1,"colorStr":"green"}}]')
      this.setData({
        workDetail: res,
        hisDataArr: hisDataArrData,
      });

      this.actionDuration = hisDataArrData.length > 0 ? hisDataArrData[hisDataArrData.length - 1].time : 0;

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
        progressW: 0,
        showGif: false,
        huaCount: 0
      });
      this.data.innerAudioContext.paused;
    });
    // 播放进度
    innerAudioContext.onTimeUpdate(() => {

      if(this.audioLock) return;
      let duration = innerAudioContext.duration,
        currentTime = innerAudioContext.currentTime;

      let radio = currentTime / duration;
      this.setData({
        progressW: radio * 100
      });
      // 动作时间，要和音频一样的时间长度
      let actionTime = currentTime * 1000;//radio * duration;
      
      // 循环动作
      this.drawCanvas(actionTime);
      this.duration = duration;
    });

    innerAudioContext.onSeeked(() => {
      innerAudioContext.play();
      this.audioLock = false;
    })

  },

  // 拖拽进度条
  onDrag: function(e) {
    let currentValue = e.detail.value;

    this.casTimeUp(currentValue);
  },

  onChange: function(e) {
    let currentValue = e.detail;

    this.casTimeUp(currentValue);
  },

  // 计算快进
  casTimeUp: function(currentValue) {
    const { innerAudioContext } = this.data;

    let radio = currentValue / 100;

    // 先暂停在seek，不然不执行onTimeUpdate
    this.audioLock = true;
    innerAudioContext.pause();
    innerAudioContext.seek(radio * this.duration);
    // setTimeout(() => {
    //   innerAudioContext.play();
    // }, 300);



    // 重置绘图数组
    this.data.hisDataArr.forEach(item => {
      if(item.operation !== 'flower') {
        item.isDraw = false;
      }
    });
     // 动作时间
     let actionTime = radio * this.actionDuration;
     // 循环动作
     context.clearRect(0, 0, this.data.ix * 0.9, this.data.iy * 0.85);//清除多大范围的画布
     this.drawCanvas(actionTime);
  },

  play: function() {
    const { innerAudioContext } = this.data;

    this.setData({
      playStatus: 1
    });
    context.clearRect(0, 0, this.data.ix * 0.9, this.data.iy * 0.85);//清除多大范围的画布
    innerAudioContext.play();

    // this.start();

    // 主动读取一次 this.data.innerAudioContext.paused，不然重新播放onTimeUpdate不执行
    setTimeout(() => {
      console.log(this.data.innerAudioContext.paused)
    }, 100)
  },

  replay: function() {
    const { innerAudioContext, hisDataArr } = this.data;
    // 重置绘图数组
    hisDataArr.forEach(item => {
      item.isDraw = false;
    });

    this.setData({
      playStatus: 1,
      showGif: false,
      huaCount: 0,
      hisDataArr
    });
    innerAudioContext.play();

    // this.restart();

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
  },

  // 绘制圆圈
  drawCanvas: function(actionTime) {
    let that = this;
    const { hisDataArr } = that.data;
    var len = this.data.hisDataArr.length;

    if(len === 0) {
      return;
    }

    for(let i = 0; i < hisDataArr.length; i++) {
      let item = hisDataArr[i];

      if(!item.isDraw && (actionTime > item.time)) {
        switch (item.operation) {
          case "mapping":
            // context.setStrokeStyle(item.lineArr.colorStr);
            // context.moveTo(item.lineArr.startX , item.lineArr.startY );
            // context.lineTo(item.lineArr.currentX , item.lineArr.currentY );
            // context.stroke();
            // context.draw(true);
            // item.isDraw = true;
            break;
          case "clearCanvas":
            context.clearRect(0, 0, that.data.ix, that.data.iy);
            context.draw(true);
            item.isDraw = true;
            break;
          case "clearLine":
            context.clearRect(item.lineArr.currentX-12, item.lineArr.currentY-12, 24, 24);
            context.draw(true);
            item.isDraw = true;
            break;
          case "circle":
            context.setStrokeStyle(item.lineArr.colorStr);
            if(item.lineArr.colorStr == "red"){
              context.arc(item.lineArr.startX *that.data.width, item.lineArr.startY *that.data.height , 13, 0, 2 * Math.PI);
            }else{
              context.arc(item.lineArr.startX *that.data.width, item.lineArr.startY *that.data.height , 15, 0, 2 * Math.PI);
            }
  
            context.stroke();
            context.draw(true);
            item.isDraw = true;
            break;
          case "gif":
            this.setData({
              showGif: item.isShow
            });
            item.isDraw = true;
            break;
          case "flower":
            // do someing
            this.setData({
              huaCount: this.data.huaCount + 1
            });

            item.isDraw = true;
            break;
        }
      }
      
    }
  },

  toUserInfo: function(e) {
    const { userid } = e.currentTarget.dataset;

    wx.navigateTo({
      url: '/pages/my-other/index?user_id=' + userid
    })
  },


  onLikeClick: function(e) {
    if(!this.wxlogin) {
      this.setData({
        wxlogin: false
      });
    }

    const { id } = e.currentTarget.dataset;
    const { workDetail } = this.data;
    API.likeWork({
      work_id: id
    }).then(res => {
        workDetail.like_num = workDetail.is_like === 0 ? workDetail.like_num + 1 : workDetail.like_num - 1;
        workDetail.is_like = workDetail.is_like === 0 ? 1 : 0;

        this.setData({
          workDetail
        });
    })
  },

  onShareAppMessage: function() {
    const { workDetail } = this.data;

    API.shareWork({
      work_id: workDetail.work_id
    })
      .then(res => {})

    return {
      title: `快来给@${workDetail.nick_name}的作品点赞，TA已练字${workDetail.userCoinageCount}天`,
      path: `/pages/work-detail/index?work_id=${workDetail.work_id}&share=true`,
      //imageUrl: workDetail.img_url
    };
  }


})
