let youshi = false;
let shurukuang = document.getElementById("shurukuang");
let anNiu = document.getElementById("anNiu");
function change() {
  if (youshi) {
    // 此时按钮为✘，点击后变为✔，清空输入的内容
    youshi = false;
    anNiu.innerText = "✔";
    shurukuang.style.borderBottomColor = "#d43744";
    shurukuang.value = "";
    shurukuang.readOnly = false;
    window.localStorage.removeItem("shi");
  } else {
    // 此时按钮为✔，点击后变为✘,保存输入的内容
    youshi = true;
    anNiu.innerText = "✘";
    shurukuang.style.borderBottomColor = "transparent";
    shurukuang.readOnly = true;
    window.localStorage.setItem("shi", shurukuang.value);
  }
}
let data = window.localStorage.getItem("shi");
if (data) {
  document.getElementById("shurukuang").value = data;
  change();
}
