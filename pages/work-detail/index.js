//index.js
//获取应用实例
const API = require('../../config/api.js');

var startDate;
var date;
var curTime;
var context = null;
var timer = null;

Page({
  data: {
    workDetail: {},
    work_id: '',
    hisDataArr: []
  },
  onLoad: function (options) {
    this.setData({
      work_id: options.work_id
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
          iy: wh,
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
      }, () => {
        console.log(this.data.hisDataArr);
        this.start()
      });
    })
  },

  start:function(){
    // if(this.data.commentflag == 2){
    //   if(this.data.playStatus == 0){
        // this.onPlay();
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
        //未播放，转到播放1
    //   }else if(this.data.playStatus == 1){
    //     //正在播放1，转到暂停2
    //     this.data.innerAudioCtx.pause();
    //     clearInterval(timer);
    //     date = new Date();
    //     startDate = date.getTime();
    //     this.setData({
    //       playStatus: 2,
    //       pausetimes: startDate,
    //     });
    //     console.log("暂停了");
    //   }else if(this.data.playStatus == 2){
    //     //暂停2，转到播放1
    //     this.data.innerAudioCtx.play();
    //     clearInterval(timer);
    //     date = new Date();
    //     startDate = date.getTime();
    //     console.log("startDate is "+startDate);
    //     var i = 0;
    //     var that = this;
    //     var len = this.data.hisDataArr.length;
    //     timer = setInterval(function(){
    //       date = new Date();
    //       curTime = date.getTime() - startDate;
    //       //console.log("time is "+curTime);
    //       if (curTime >= that.data.hisDataArr[i].time){
    //         switch (that.data.hisDataArr[i].operation) {
    //           case "mapping":
    //             context.setStrokeStyle(that.data.hisDataArr[i].lineArr.colorStr);
    //             context.moveTo(that.data.hisDataArr[i].lineArr.startX , that.data.hisDataArr[i].lineArr.startY );
    //             context.lineTo(that.data.hisDataArr[i].lineArr.currentX , that.data.hisDataArr[i].lineArr.currentY );
    //             context.stroke();
    //             context.draw(true);
    //             break;
    //           case "clearCanvas":
    //             context.clearRect(0, 0, that.data.ix, that.data.iy);
    //             context.draw(true);
    //             break;
    //           case "clearLine":
    //             context.clearRect(that.data.hisDataArr[i].lineArr.currentX-12, that.data.hisDataArr[i].lineArr.currentY-12, 24, 24);
    //             context.draw(true);
    //             break;
    //           case "circle":
    //             context.setStrokeStyle(that.data.hisDataArr[i].lineArr.colorStr);
    //             if(that.data.hisDataArr[i].lineArr.colorStr == "red"){
    //               context.arc(that.data.hisDataArr[i].lineArr.startX *that.data.ix, that.data.hisDataArr[i].lineArr.startY *that.data.iy , 13, 0, 2 * Math.PI);
    //             }else{
    //               context.arc(that.data.hisDataArr[i].lineArr.startX *that.data.ix, that.data.hisDataArr[i].lineArr.startY *that.data.iy , 15, 0, 2 * Math.PI);
    //             }

    //             context.stroke();
    //             context.draw(true);
    //             break;
    //         }
    //         i++;
    //       }
    //       if(i >= len){
    //         clearInterval(timer);
    //       }
    //     },2);
    //     date = new Date();
    //     startDate = date.getTime();
    //     this.setData({
    //       playStatus: 1,
    //       pausetimes: startDate,
    //     });
    //     console.log("暂停又继续了 2-1");
    //   }else if(this.data.playStatus == 3){
    //     //播放完3，转到未播放0
    //     this.setData({
    //       playStatus: 0,
    //     });
    //     console.log("重听");
    //   }
    // }else{
    //   console.log("没东西不给听");
    // }
  },


})
