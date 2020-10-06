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

    isShow: false
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
      this.setData({
        chapterList: res || [],
        selectChapter: res && res[0] || {}
      })
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
    })
  },

  // 选中章节
  onSelectChapter: function(e) {
    const { chapterdata } = e.currentTarget.dataset;

    this.setData({
      selectChapter: chapterdata
    });
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
    const { params, selectChapter } = this.data;
    // ?course_id=${params.courseId}&week_id=${params.weekId}&week_num=${params.weekNum}&section_num=${selectChapter.section_num}&section_id=${selectChapter.section_id}
    let data = {
      course_id: params.courseId,
      week_id: params.weekId,
      week_num: params.weekNum,
      section_num: selectChapter.section_num,
      section_id: selectChapter.section_id
    };

    wx.navigateTo({
      url: `/pages/course-upload/index?data=${JSON.stringify(data)}`,
    });
  }

})
