import * as echarts from '../../ec-canvas/echarts';

function initChart(canvas, width, height) {
  const chart = echarts.init(canvas, null, {
    width: width,
    height: height
  });
  canvas.setChart(chart);

  let tableData = getData()
  console.log(tableData)

  var option = {
    tooltip: {
      show: false
    },
    dataZoom: [
      {
        id: 'dataZoomY',
        type: 'slider',
        yAxisIndex: [0],
        filterMode: 'empty'
      },
      {
        id: 'dataZoomY1',
        type: 'inside',
        yAxisIndex: [0],
        filterMode: 'empty'
      }
    ],
    xAxis: {
      position: 'top',
      type: 'value',
      nameRotate: -90,
      axisLabel: {  //坐标轴刻度标签的相关设置。
        rotate: 90 //刻度标签旋转的角度，
      },
      scale: true, //是否是脱离 0 值比例
    },
    yAxis: {
      data: tableData[0],
      inverse: 'true', //是否是反向坐标轴。
      axisLabel: {
        rotate: -90
      }
    },
    series: [{
      name: '金额',
      type: 'line',
      data: tableData[1],
      itemStyle: { normal: { label: { show: true, rotate :-90} } },
      symbolRotate:90
    }]
  };

  chart.setOption(option);
  return chart;
}


/**
    * 获取x和y轴数据
    */
function getData() {
  let baseDate = new Date() // user input
  let baseMny =  0 // user input
  let expectMonthCount = 30 // user input
  let projects0 = JSON.parse(wx.getStorageSync("projects"));
  let projects = projects0
  // [
  //         { "name": "gjj", "mny": 4500, "cycleBase": "2019/02/01", "cycle": 3 },
  //         { "name": "gz", "mny": 10950, "cycle": 1 },
  //         { "name": "shf", "mny": -1500, "cycle": 1 },
  //         { "name": "fz", "mny": -1200, "cycle": 1 },
  //         { "name": "fd", "mny": -3800, "cycle": 1 },

  //         { "name": "gjj", "mny": 4500, "cycleBase": "2019/01/01", "cycle": 3 },
  //         { "name": "gz", "mny": 8600, "cycle": 1 },
  //         { "name": "shf", "mny": -1500, "cycle": 1 },
  //         { "name": "fz", "mny": -1000, "cycle": 1 },

  //         { "name": "nh", "mny": -5000, "cycleBase": "2019/01/01", "cycle": 12 },
  //         { "name": "ywhx", "mny": -30000, "cycleBase": "2018/12/12", "cycle": 12 },
  //       ] //user input && build
  let xAxis = [] // pro fill
  let xData = []	// pro fill

  for (let i = 0; i < expectMonthCount; i++) {
    let thisMonth = newDate(baseDate, i);
    let monthOfYear = thisMonth.getFullYear() + '' + thisMonth.getMonth() + "";

    for (let j = 0; j < projects.length; j++) {
      let mny = projects[j].mny;
      let cycle = projects[j].cycle;
      let cycleBase = projects[j].cycleBase;
      if (cycle > 1 && cycleBase) {
        let cycleBaseDate = new Date(cycleBase)
        cycleBase = cycleBaseDate.getFullYear() + '' + cycleBaseDate.getMonth() + "";
      }

      if (monthOfYear - cycleBase < 0) continue;

      // if cycle bigger 1, to judge this peoject weather shot base on baseDate
      if (cycle > 1) {
        if ((diffMonth(monthOfYear, cycleBase)) % cycle == 0) {
          baseMny += mny;
        }
      } else {
        baseMny += mny;
      }
    }

    let thisMonthStr = formatDate(thisMonth);
    xAxis.push(thisMonthStr);
    xData.push(baseMny);
  }

  return [xAxis, xData];
}

function formatDate(date) {
  return date.getFullYear() + '-' + (date.getMonth() + 1);
}

function newDate(date, i) {
  var myDate = new Date()
  let oldMonth = date.getMonth();
  let nextMonth = oldMonth + i;
  if ((nextMonth / 12) >= 1) {
    myDate.setFullYear(date.getFullYear() + parseInt(nextMonth / 12))
    myDate.setMonth(nextMonth % 12, 1);
  } else {
    myDate.setFullYear(date.getFullYear())
    myDate.setMonth(date.getMonth() + i, 1);
  }
  console.log("oldMonth:" + oldMonth + ",add：" + i + ",nextMonth: " + nextMonth + " = result[month:" + myDate.getMonth() + ",year:" + myDate.getFullYear())

  return myDate;
}

function diffMonth(bigMonth, baseMonth) {
  let bigYear = parseInt(bigMonth.substring(0, 4))
  let baseYear = parseInt(baseMonth.substring(0, 4))
  let bigMonth1 = parseInt(bigMonth.substring(4))
  let baseMonth1 = parseInt(baseMonth.substring(4))

  if (bigYear == baseYear) {
    return bigMonth1 - baseMonth1;
  }

  return bigMonth1 + ((bigYear == baseYear) * 12) - baseMonth1
}



// pages/main.js
let page = Page({

  /**
   * 页面的初始数据
   */
  data: {
    ec: {
      onInit: initChart
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})