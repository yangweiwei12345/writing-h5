import * as echarts from '../../components/ec-canvas/echarts';
const API = require('../../config/api.js');
const app = getApp();
let chart = null;
const options = {
  title: {
    left: 'center'
  },
  color: ["#FFAA00", "#0099FF"],
  legend: {
    data: ['今日销售', '新增客户'],
    top: 0,
    z: 100
  },
  grid: {
    containLabel: true,
    left: 0
  },
  tooltip: {
    show: true,
    trigger: 'axis'
  },
  xAxis: {
    type: 'category',
    boundaryGap: false,
    data: [],
    // show: false
  },
  yAxis: {
    x: 'center',
    type: 'value',
    splitLine: {
      lineStyle: {
        type: 'dashed'
      }
    }
    // show: false
  },
  series: [{
    name: '今日销售',
    type: 'line',
    smooth: true,
    data: []
  }, {
    name: '新增客户',
    type: 'line',
    smooth: true,
    data: []
  }]
};

function initChart(canvas, width, height, dpr) {
  chart = echarts.init(canvas, null, {
    width: width,
    height: height,
    devicePixelRatio: dpr // new
  });
  canvas.setChart(chart);

  chart.setOption(options);
  return chart;
}

Page({
  data: {
    data: {},
    ec: {
      onInit: initChart
    }
  },
  onLoad: function () {
    this.getRetail();
  },
  onShow: function() {
  },

  getRetail: function() {

    wx.showLoading({
      title: '数据请求中...',
    });

    API.retail({})
      .then(res => {
        wx.hideLoading();
        let data = res || {};
        this.setData({
          data: res || {}
        });

        let saleData = [], customerData = [], xDate = [];
        (data.chart || []).forEach(item => {
          saleData.push(item.customer);
          customerData.push(item.sale);
          xDate.push(item.date);
        });
        console.log(data.chart, saleData)
        options.xAxis.data = xDate;
        options.series[0].data = saleData;
        options.series[1].data = customerData;
        console.log(options);
        chart.setOption(options);

      })
      .catch(e => {
        wx.hideLoading();
      })

  },


  onToPage: function(e) {
    const { type } = e.currentTarget.dataset;
    let url = '';

    if(type === 'order') {
      url = '/pages/sale-order/index';
    } else if(type === 'course') {
      url = '/pages/sale-code/index';
    } else {
      this.setData({
        showCode: true
      });
      return;
    }

    wx.navigateTo({
      url
    })
  },
  onCloseCode: function() {
    this.setData({
      showCode: false
    });
  },


  toUser: function(e) {
    const { id } = e.currentTarget.dataset;

    wx.navigateTo({
      url: '/pages/sale-people/index?courseId=' + id
    })
  }
})
