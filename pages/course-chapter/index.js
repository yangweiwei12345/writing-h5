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

    paginaData: {
      page: 1,
      pageSize: 10
    },
    workList: [],
    count: 0
  },
  onLoad: function (options) {
    this.setData({
      params: {
        ...options
      }
    }, () => {
      this.getWork();
    });
  },
  onShow: function() {
    setTimeout(() => {
      this.getCourseSection();
    }, 300);
  },

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
          wx.setNavigationBarTitle({
            title: chapterItem.section_title
          })
          console.log(chapterItem, 'chapterItem')

          let videoLen = (chapterItem.video_list || []).length;
          for(let j = videoLen -1; j >= 0; j--) {
            let videoItem = chapterItem.video_list[j];

            //  && j !== 0
            if(videoItem.is_clock === 0) {
              this.setData({
                selectVideo: videoItem
              })
              if(j === (videoLen - 1) && chapterItem.have_work === 0) {
                this.setData({
                  canUploadWork: true
                });
              } else {
                this.setData({
                  canUploadWork: false
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
      selectChapter: chapterdata,
      isShow: false
    });
    wx.setNavigationBarTitle({
      title: chapterdata.section_title
    })

    let videoLen = (chapterdata.video_list || []).length;
    for(let j = videoLen -1; j >= 0; j--) {
      let videoItem = chapterdata.video_list[j];

      //  && j !== 0
      if(videoItem.is_clock === 0) {
        this.setData({
          selectVideo: videoItem
        })
        if(j === (videoLen - 1) && chapterdata.have_work === 0) {
          this.setData({
            canUploadWork: true
          });
        } else {
          this.setData({
            canUploadWork: false
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
  },

  getWork: function() {
    API.courseWorkList({
      ...this.data.paginaData,
      section_id: this.data.params.section_id
    }).then(res => {//成功
      this.setData({
        workList: res && res.rows || [],
        count: res && res.count || 0
      })
    })
  },

  onLikeClick: function(e) {
    const { workList } = this.data;
    const { id } = e.currentTarget.dataset;
    API.likeWork({
      work_id: id
    }).then(res => {
      workList.forEach(item => {
        if(item.work_id == id) {
          item.like_num = item.is_like === 0 ? item.like_num + 1 : item.like_num - 1;
          item.is_like = item.is_like === 0 ? 1 : 0;
        }
      })
      this.setData({
        workList
      });
    })
  }

})
