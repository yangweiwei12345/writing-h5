const API = require('../config/api');
const regeneratorRuntime = require('./runtime.js');

async function checkSession(){
  return new Promise((resolve, reject) => {
    wx.checkSession({
      success() {
        return resolve(true)
      },
      fail() {
        return resolve(false)
      }
    })
  })
}

// 检测登录状态，返回 true / false
async function checkHasLogined() {

  const token = wx.getStorageSync('token')
  if (!token) {
    return false
  }
  const loggined = await checkSession()
  if (!loggined) {
    wx.removeStorageSync('token')
    return false
  }
  const isUserInfo = await getUserInfo();
  if(!isUserInfo) {
    wx.removeStorageSync('token')
    return false;
  }
  return true
  
}

function isLogin() {
  return new Promise((resolve, reject) => {
    checkHasLogined().then(res => {
      resolve(res);
    }).catch(e => {
      resolve(false)
    })
  })
}

function getUserInfo() {
  return new Promise((resolve, reject) => {
    API.getUserInfo({
    }).then(res => {//成功
      if(res && res.code == 401) {
        resolve(false);
      } else {
        resolve(true);
      }
    }).catch(err => {
      resolve(true);
    })
  })
  
}

function loginOut(){
  wx.removeStorageSync('token')
  wx.removeStorageSync('userId')
}

module.exports = {
  checkHasLogined,
  loginOut,
  isLogin
}
