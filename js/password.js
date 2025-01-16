// 定义一个函数 password
function password() {
  var testV = 1; // 初始化一个变量 testV，初始值为1

  // 提示用户输入密码
  var pass1 = prompt("请输入五班口号后四字:", "");

  // 当 testV 小于 3 时，进入循环
  while (testV < 3) {
    // 如果用户没有输入密码，返回上一页
    if (!pass1) history.go(-1);

    // 如果用户输入的密码是 "我自凯旋"
    if (pass1 == "我自凯旋") {
      alert("密码正确!"); // 弹出提示框，显示“密码正确!”
      location.href = "xphoto.html"; // 跳转到 xphoto.html 页面
      break; // 退出循环
    }

    testV += -1; // 将 testV 减 1

    // 提示用户重新输入密码
    var pass1 = prompt("密码错误!请重新输入:");
  }

  // 如果用户输入的密码不是 "password" 且 testV 等于 3，返回上一页
  if ((pass1 != "password") & (testV == 3)) history.go(-1);

  return " "; // 返回一个空字符串
}

// 调用 password 函数，并将返回值写入文档
document.write(password());
