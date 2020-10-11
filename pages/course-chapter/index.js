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
    selectChapterIndex: '',
    // 选中的视频
    selectVideo: {},
    selectVideoIndex: '',

    WEEKS: config.WEEKS,

    isShow: false,
    canUploadWork: false,   // 是否可以上传作业

    paginaData: {
      page: 1,
      pageSize: 20
    },
    workList: [],
    count: 0,

    hasMore: true,

    showModal: false
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
  onShow: function() {
    setTimeout(() => {
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
        let selectChapterIndex = i;

        // 观看数和视频数相等，并且没有上传过作业
        if(chapterItem.look_video_num === chapterItem.video_count && chapterItem.have_work === 0) {
          this.setData({
            canUploadWork: true
          });
          // this.onShowModal();
        } else {
          this.setData({
            canUploadWork: false
          });
        }

        if(chapterItem.is_clock === 0) {
          this.setData({
            selectChapter: chapterItem,
            hasMore: true,
            workList: [],
            count: 0,
            paginaData: {
              page: 1,
              pageSize: 20
            }
          }, () => {
            this.getWork();
          });
          wx.setNavigationBarTitle({
            title: chapterItem.section_title
          })
          console.log(chapterItem, 'chapterItem')

          let videoLen = (chapterItem.video_list || []).length;
          for(let j = videoLen -1; j >= 0; j--) {
            let videoItem = chapterItem.video_list[j];
            let selectVideoIndex = j;

            //  && j !== 0
            if(videoItem.is_clock === 0) {
              this.setData({
                selectVideo: videoItem
              })
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
      isShow: false,
      hasMore: true,
      workList: [],
      count: 0,
      paginaData: {
        page: 1,
        pageSize: 20
      }
    }, () => {
      this.getWork();
    });
    wx.setNavigationBarTitle({
      title: chapterdata.section_title
    })

    if(chapterdata.look_video_num === chapterdata.video_count && chapterdata.have_work === 0) {
      this.setData({
        canUploadWork: true
      });

      // this.onShowModal();
    } else {
      this.setData({
        canUploadWork: false
      });
    }

    let videoLen = (chapterdata.video_list || []).length;
    for(let j = videoLen -1; j >= 0; j--) {
      let videoItem = chapterdata.video_list[j];

      //  && j !== 0
      if(videoItem.is_clock === 0) {
        this.setData({
          selectVideo: videoItem
        })
        
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
    this.onClose();
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


  toWorkDetail: function(e) {
    const { id } = e.currentTarget.dataset;

    wx.navigateTo({
      url: '/pages/work-detail/index?work_id=' + id
    })
  },

  getWork: function() {
    API.courseWorkList({
      ...this.data.paginaData,
      section_id: this.data.selectChapter.section_id
    }).then(res => {//成功
      let data = res && res.rows || [];
      let hasMore = true;
      let { workList, paginaData } = this.data;

      if(data.length < paginaData.pageSize) {
        hasMore = false; 
      }
      this.setData({
        hasMore,
        workList: workList.concat(data),
        count: res && res.count || 0,
        paginaData: {
          ...paginaData,
          page: paginaData.page + 1
        }
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
  },

  // 上拉加载
  onReachBottom() {
    const { hasMore } = this.data;

    if(!hasMore) {
      return;
    }

    this.getWork();
    
  },

  onClose: function() {
    this.setData({
      showModal: false
    });
  },

  onShowModal: function() {
    this.setData({
      showModal: false
    });
  },

  lookFinish: function() {
    Dialog.alert({
      message: '你今日学习次数已上限，请复习之前学习过的视频吧',
    }).then(() => {
    });
  }

})
