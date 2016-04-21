/* 数据格式演示
var aqiSourceData = {
  "北京": {
    "2016-01-01": 10,
    "2016-01-02": 10,
    "2016-01-03": 10,
    "2016-01-04": 10
  }
};
*/
// 以下两个函数用于随机模拟生成测试数据
function addEventHandler(ele, event, handle) {
  if (ele.addEventHandler) {
    ele.addEventHandler(ele, event, handle);
  } else if (ele.attachEvent) {
    ele.attachEvent(ele, event, handle);
  } else {
    ele["on" + event] = handle;
  }
}

function getDateStr(dat) {
  var y = dat.getFullYear();
  var m = dat.getMonth() + 1;
  m = m < 10 ? '0' + m : m;
  var d = dat.getDate();
  d = d < 10 ? '0' + d : d;
  return y + '-' + m + '-' + d;
}

function randomBuildData(seed) {
  var returnData = {};
  var dat = new Date("2016-01-01");
  var datStr = '';
  for (var i = 1; i < 92; i++) {
    datStr = getDateStr(dat);
    returnData[datStr] = Math.ceil(Math.random() * seed);
    dat.setDate(dat.getDate() + 1);
  }
  return returnData;
}
var aqiSourceData = {
  "北京": randomBuildData(500),
  "上海": randomBuildData(300),
  "广州": randomBuildData(200),
  "深圳": randomBuildData(100),
  "成都": randomBuildData(300),
  "西安": randomBuildData(500),
  "福州": randomBuildData(100),
  "厦门": randomBuildData(100),
  "沈阳": randomBuildData(500)
};
// 用于渲染图表的数据
var chartData = {};

// 记录当前页面的表单选项
var pageState = {
  nowSelectCity: '北京',
  nowGraTime: "day"
}
var colors = [
  '#3A919E',
  '#28585A',
  '#8EDCAD',
  '#EED5F5',
  '#98E4D6',
  '#67C4EF',
  '#EFE69C',
  '#D6A8DE',
  '#FFD4C6',
  '#EF8B8B',
  '#DAD6E6',
  '#DFFFCF',
  '#AACCEF',
  '#FFC278',
  '#EFC4C4'

];
var formGraTime = document.getElementById('form-gra-time');
var citySelect = document.getElementById('city-select');
//生成不重复的数
function getRandomArr() {
  var sub_arr = new Array(); //生成的随机数数组
  var has_arr = new Array(); //稀疏数组，判断该数字是否已经选出
  var temp = '';
  for (var i = 0; i <= 14; i++) {
    do {
      temp = getRandomNum(0, 14);
    } while (has_arr[temp] !== undefined) //判断该选出的数字是否已经选出
    has_arr[temp] = 'has'; //该数字作为偏移量，加入稀疏数组记录为已选
    sub_arr[i] = temp;
  }
  return sub_arr;
}

function getRandomNum(min, max) { //生成一个随机数从[min,max]
  return min + Math.round(Math.random() * (max - min));
}
/**
 * 渲染图表
 */
function renderChart() {
  var aqiChartWrap = document.getElementsByClassName('aqi-chart-wrap')[0];
  initAqiChartData();
  var str = '';
  var colorsArr=getRandomArr();
  var j = 0;
  for (var i in chartData) {
    str += '<span class="span-' + pageState.nowGraTime + '"' + 'style="height:' + chartData[i] + 'px; background-color:' + colors[colorsArr[j++]] + ';">' + '</span>';
    if (j == 15) {
      j = 0;
    }
  }
  aqiChartWrap.innerHTML = str;
  //   if (pageState.nowGraTime=='day') {

  // }
  // else if (pageState.nowGraTime=='week') {}
  //  else{}
}

/**
 * 日、周、月的radio事件点击时的处理函数
 */
function graTimeChange() {
  var time = this.value;
  if (time !== pageState.nowGraTime) { // 确定是否选项发生了变化 
    // 设置对应数据
    pageState.nowGraTime = time;
    // 调用图表渲染函数
    renderChart();
  }
}

/**
 * select发生变化时的处理函数
 */
function citySelectChange() {
  var city = this.value;
  if (city !== pageState.nowSelectCity) { //发生变化时渲染函数
    // 设置对应数据
    pageState.nowSelectCity = city;
    // 调用图表渲染函数
    renderChart();
  }
}
/**
 * 初始化日、周、月的radio事件，当点击时，调用函数graTimeChange
 */
function initGraTimeForm() {
  var radio = document.getElementsByName('gra-time');
  for (var i = 0; i < radio.length; i++) {
    addEventHandler(radio[i], 'click', graTimeChange)
  }
}
/**
 * 初始化城市Select下拉选择框中的选项
 */
function initCitySelector() {
  var str = '';
  // 读取aqiSourceData中的城市，然后设置id为city-select的下拉列表中的选项
  for (var i in aqiSourceData) {
    str += "<option>" + i + "</option>";
  }
  citySelect.innerHTML = str;

  // 给select设置事件，当选项发生变化时调用函数citySelectChange    
  addEventHandler(citySelect, 'change', citySelectChange);

}
/**
 * 初始化图表需要的数据格式
 */
function initAqiChartData() {
  // 将原始的源数据处理成图表需要的数据格式
  var dataArray = aqiSourceData[pageState.nowSelectCity];
  if (pageState.nowGraTime == 'day') {
    chartData = dataArray;
  }
  //周逻辑
  if (pageState.nowGraTime == 'week') {
    chartData = {};
    var weekDSum = 0,
      day = 0,
      week = 0
    for (var i in dataArray) {
      weekDSum += dataArray[i]; //一周雨量
      day++;
      if (new Date(i).getDay() == 6) {
        chartData['第' + week + '周'] = Math.floor(weekDSum / day);
        weekDSum = 0;
        day = 0;
        week++;
      }
    }
    //不满足一周按一周算
    if (day != 0) {
      chartData['第' + week + '周'] = Math.floor(weekDSum / day);
    }
  }
  //月逻辑
  if (pageState.nowGraTime == 'month') {

    chartData = {};
    var monthDSum = 0,
      day = 0,
      month = 0;
    for (var i in dataArray) {
      if (new Date(i).getMonth() == month) {
        day++;
        monthDSum += dataArray[i];
      }
      //一月降水量
      else if (new Date(i).getMonth() != month) {
        chartData['第' + month + '月'] = Math.floor(monthDSum / day)
        monthDSum = dataArray[i];
        day = 1;
        month++;
      }
    }
    //不足一月按一月算
    if (day != 0) {
      chartData['第' + month + '月'] = Math.floor(monthDSum / day)
    }
  }
}
/**
 * 初始化函数
 */
function init() {
  initGraTimeForm()
  initCitySelector();
  initAqiChartData();
}
init();