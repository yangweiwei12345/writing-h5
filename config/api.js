const request = require('../utils/request.js');
const host = 'http://xz-api.defengvip.com';

const API =  {
  /**
   * ========= 用户信息 =========
   */
  // 登录
  login: {
    url: '/api/login/login',
    method: 'POST'
  },
  // 用户详情
  getUserInfo: {
    url: '/api/user/info',
    method: 'POST'
  },
  // 修改用户信息
  editUserInfo: {
    url: '/api/user/editDetail',
    method: 'post'
  },

  /**
   * ========= 首页 =========
   */
  // banner type 1 =》 首页
  banner: {
    url: '/api/sys/banner',
    method: 'post'
  },
  // 首页课程
  indexCourse: {
    url: '/api/sys/indexCourse',
    method: 'post'
  },
  // 首页新闻
  news: {
    url: '/api/sys/news',
    method: 'post'
  },

  /**
   * ========= 上课 =========
   */
  // 课程列表
  courseList: {
    url: '/api/course/courseList',
    method: 'post'
  },
  // 我的课程列表
  userCourseList: {
    url: '/api/course/userCourseList',
    method: 'post'
  },
  // 课程周计划
  courseWeekList: {
    url: '/api/course/courseWeekList',
    method: 'post'
  },
  // 课程章节详情
  courseSection: {
    url: '/api/course/courseSection',
    method: 'post'
  },
  // 用户观看视频 
  lookOverVideo: {
    url: '/api/course/lookOverVideo',
    method: 'post'
  },
  // 提交作业 
  addCourseWork: {
    url: '/api/course/addCourseWork',
    method: 'post'
  },
  // 作业列表 
  courseWorkList: {
    url: '/api/course/courseWorkList',
    method: 'post'
  },
  // 作业详情
  workDetail: {
    url: '/api/course/workDetail',
    method: 'post'
  },
  // 课程分享
  shareWork: {
    url: '/api/course/shareWork',
    method: 'post'
  },
  // 点赞作业
  likeWork: {
    url: '/api/course/likeWork',
    method: 'post'
  },

  // 图片上传
  upload: {
    url: '/api/upload/index',
    method: 'post'
  }
};

let API_RES = {};
Object.keys(API).forEach(key => {
  let item = API[key];
  const { url, method } = item;
  if(method === 'POST' || method === 'post' || !method) {
    API_RES[key] = (data = {}, header) => request._post(host + url, data, false, header);
  } else if(method === 'GET' || method === 'get') {
    API_RES[key] = (data = {}) => request._get(host + url, data);
  }
})

module.exports = API_RES;