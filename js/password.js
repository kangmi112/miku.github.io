function password() {
  var testV = 1;

  var pass1 = prompt("请输入五班口号后四字:", "");

  while (testV < 3) {
    if (!pass1) history.go(-1);

    if (pass1 == "我自凯旋") {
      alert("密码正确!");
      location.href = "photo.html";
      break;
    }

    testV += -1;

    var pass1 = prompt("密码错误!请重新输入:");
  }

  if ((pass1 != "password") & (testV == 3)) history.go(-1);

  return " ";
}

document.write(password());
