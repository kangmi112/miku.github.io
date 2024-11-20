var day = document.querySelector(".sp1");
var hour = document.querySelector(".sp2");
var minute = document.querySelector(".sp3");
var second = document.querySelector(".sp4");
var time = +new Date("2025-1-1 00:00:00");

//调用函数,防止进入页面要过一秒才显示倒计时
countDown();

//启用定时器
setInterval(countDown, 1000);

function countDown() {
  var now_time = +new Date();
  var times = (now_time - time) / 1000; //剩余秒数
  //转换
  var d = parseInt(times / 60 / 60 / 24); //天
  var h = parseInt((times / 60 / 60) % 24); //时
  var m = parseInt((times / 60) % 60); //分
  var s = parseInt(times % 60); //秒
  //写进网页
  day.innerHTML = d + "天";
  hour.innerHTML = h + "时";
  minute.innerHTML = m + "分";
  second.innerHTML = s + "秒";
}
