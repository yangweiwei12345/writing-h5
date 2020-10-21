const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

// 校验手机号
const checkPhone = phone => {
  let reg = /^[1][0-9]{10}$/;  
  if (!reg.test(phone)) {  
    return false;  
  } else {  
    return true;  
  } 
}

module.exports = {
  formatTime: formatTime,
  checkPhone
}
