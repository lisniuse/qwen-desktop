// 定义要查找的字符串
var targetString = "登录/注册";

// 获取class为'container--bTI3XoGm'的元素
var headerDivs = document.querySelectorAll('div[class^="header--"]');
parentElement = headerDivs[0]

// 检查父元素是否存在
if (parentElement) {
  // 获取该父元素下的所有div子元素
  var divs = parentElement.querySelectorAll('div');

  // 初始化一个变量来记录包含目标字符串的元素的索引
  var targetIndex = -1;

  // 遍历所有div子元素
  for (var i = 0; i < divs.length; i++) {
    // 获取当前div元素的文本内容
    var divText = divs[i].textContent || divs[i].innerText;

    // 检查文本内容是否包含目标字符串
    if (divText.includes(targetString)) {
      // 如果找到包含目标字符串的div，记录索引
      targetIndex = i;
      break;
    }
  }

  // 如果找到了包含目标字符串的元素，点击它
  if (targetIndex !== -1) {
    var targetElement = divs[targetIndex];
  } else {
    // 否则，点击最后一个div子元素
    var targetElement = divs[divs.length - 1];
  }

  // 模拟点击事件
  if (targetElement) {
    targetElement.dispatchEvent(new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
      view: window
    }));
  }
}
