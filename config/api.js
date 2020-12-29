const request = require('../utils/request.js');
// 测试环境
const host = 'http://xz-api.defengvip.com';

// 正式环境
// export const host = 'https://klxxcx.klart.cn';

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
  // 别人的个人详情
  otherInfo: {
    url: '/api/user/otherInfo',
    method: 'POST'
  },

  // 老师详情
  teacherInfo: {
    url: '/api/user/teacherInfo',
    method: 'POST'
  },
  // 排行榜
  ranking: {
    url: '/api/sys/ranking',
    method: 'POST'
  },

  // 忽略点评作业
  overlookWork: {
    url: '/api/course/overlookWork',
    method: 'POST'
  },

  // 作业点评
  remarkWork: {
    url: '/api/course/remarkWork',
    method: 'POST'
  },

  // 排行榜
  ranking: {
    url: '/api/sys/ranking',
    method: 'post'
  },

  // 上墙列表
  commendList: {
    url: '/api/course/commendList',
    method: 'post'
  },

  // 商品列表
  goodsList: {
    url: '/api/store/goodsList',
    method: 'post'
  },

  // 生成订单
  create: {
    url: '/api/order/create',
    method: 'post'
  },

  // 本周日历
  getWeekTask: {
    url: '/api/Task/getWeekTask',
    method: 'post'
  },

  // 任务列表
  taskList: {
    url: '/api/task/taskList',
    method: 'post'
  },

  // 订单列表
  orderList: {
    url: '/api/order/orderList',
    method: 'post'
  },

  // 积分列表
  scoreBillList: {
    url: '/api/bill/scoreBillList',
    method: 'post'
  },

  // 快递详情
  transDetail: {
    url: '/api/order/transDetail',
    method: 'post'
  },

  // 图片上传
  upload: {
    url: '/api/upload/index',
    method: 'post'
  },

  // 分销商
  retail: {
    url: '/api/retail/index',
    method: 'get'
  },

  // 开课码记录
  record: {
    url: '/api/retail/record',
    method: 'get'
  },

  // 课程搜素里的课程
  retailCourse: {
    url: '/api/retail/course',
    method: 'get'
  },

  // 分销订单
  retailOrder: {
    url: '/api/retail/order',
    method: 'get'
  },

  // 备注提交
  remark: {
    url: '/api/retail/remark',
    method: 'get'
  },

  // 客户列表
  customer: {
    url: '/api/retail/customer',
    method: 'get'
  },

  // 使用记录
  useRecord: {
    url: '/api/retail/useRecord',
    method: 'get'
  },

  // 核销
  writeOff: {
    url: '/api/retail/writeOff',
    method: 'get'
  },

  // 评测问题
  getQa: {
    url: '/api/sys/getQa',
    method: 'post'
  },

  // 提交评测问题
  level: {
    url: '/api/user/level',
    method: 'post'
  },

  // 物流
  trans: {
    url: '/api/order/trans',
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