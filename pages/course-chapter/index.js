//index.js
const API = require('../../config/api.js');
const config = require('../../config/config.js');

Page({
  data: {
    params: {},
    // 章节目录
    chapterList: [],
    // 当前选中节数
    selectChapter: {},
    // 选中的视频
    selectVideo: {},

    WEEKS: config.WEEKS,

    isShow: false,
    canUploadWork: false,   // 是否可以上传作业
  },
  onLoad: function (options) {
    this.setData({
      params: {
        ...options
      }
    }, () => {
      this.getCourseSection();
    });
  },
  onShow: function() {},

  // 章节详情
  getCourseSection: function() {
    let { params } = this.data;
    let data = {
      course_id: params.courseId,
      week_id: params.weekId,
      week_num: params.weekNum
    };
    API.courseSection(data).then(res => {//成功
      let chapterList = res || [];
      this.setData({
        chapterList: chapterList,
      });

      let len = chapterList.length;
      console.log(chapterList, len);
      for(let i = len - 1; i >= 0; i--) {
        let chapterItem = chapterList[i];

        if(chapterItem.is_clock === 0) {
          this.setData({
            selectChapter: chapterItem
          });
          console.log(chapterItem, 'chapterItem')

          let videoLen = (chapterItem.video_list || []).length;
          for(let j = videoLen -1; j >= 0; j--) {
            let videoItem = chapterItem.video_list[j];

            if(videoItem.is_clock === 0 && j !== 0) {
              this.setData({
                selectVideo: videoItem
              })
              if(j === (videoLen - 1)) {
                this.setData({
                  canUploadWork: true
                });
              }
              console.log(videoItem, 'videoItem')
              break;
            }
          }
          break;
        }
      }

      wx.hideLoading();
    }).catch(err => {
      wx.hideLoading();
    })
  },
  // 视频播放结束
  onVideoEnd: function() {
    const { params, selectChapter, selectVideo } = this.data;

    let data = {
      course_id: params.courseId,
      section_num: selectChapter.section_num,
      week_num: params.weekNum,
      video_id: selectVideo.video_id,
      video_num: selectVideo.video_num
    };

    API.lookOverVideo(data).then(res => {//成功
      wx.showLoading({
        title: '正在解锁下一个视频..'
      });
      this.getCourseSection();
    })
  },

  // 选中章节
  onSelectChapter: function(e) {
    const { chapterdata } = e.currentTarget.dataset;

    this.setData({
      selectChapter: chapterdata
    });

    let videoLen = (chapterdata.video_list || []).length;
    console.log(videoLen, chapterdata);
    for(let j = videoLen -1; j >= 0; j--) {
      let videoItem = chapterdata.video_list[j];

      if(videoItem.is_clock === 0 && j !== 0) {
        this.setData({
          selectVideo: videoItem
        })
        if(j === (videoLen - 1)) {
          this.setData({
            canUploadWork: true
          });
        }
        console.log(videoItem, 'videoItem')
        break;
      }
    }
  },

  // 选中视频
  onSelectVideo: function(e) {
    const { videodata } = e.currentTarget.dataset;

    this.setData({
      selectVideo: videodata
    });
  },

  onShowMenu: function() {
    this.setData({
      isShow: !this.data.isShow
    });
  },

  // 上传作业
  onToPhoto: function() {
    const { params, selectChapter, canUploadWork } = this.data;
    if(!canUploadWork) {
      return;
    }
    // ?course_id=${params.courseId}&week_id=${params.weekId}&week_num=${params.weekNum}&section_num=${selectChapter.section_num}&section_id=${selectChapter.section_id}
    let data = {
      course_id: params.courseId,
      week_id: params.weekId,
      week_num: params.weekNum,
      section_num: selectChapter.section_num,
      section_id: selectChapter.section_id,
      title: selectChapter.section_title
    };

    wx.navigateTo({
      url: `/pages/course-upload/index?data=${JSON.stringify(data)}`,
    });
  }

})
