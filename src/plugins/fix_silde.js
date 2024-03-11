var divs = document.querySelectorAll('div[class^="side--"]');
sideDiv = divs[0]
// sideDiv.style.width = "0px";
// sideDiv.style.overflow = "hidden";
// sideDiv.style.padding = "0";
// sideDiv.style.margin = "0";
sideDiv.style.position = "fixed";
sideDiv.style.boxSizing = "border-box";
sideDiv.style.top = "0";
sideDiv.style.background = "#fff";
sideDiv.style.boxShadow = "0px 0px 20px";
sideDiv.style.paddingTop = "20px";
sideDiv.style.overflow = "hidden";
sideDiv.style.zIndex = "1000";

// 创建新的DIV元素
// 创建一个新的<style>元素
var styleElement = document.createElement('style');

// 创建CSS规则字符串
var cssRules = `
  .side--control {
    position: fixed;
    top: 10px;
    left: 290px;
    width: 50px;
    line-height: 50px;
    height: 50px;
    text-align: center;
    line-height: 50px; /* 使文本垂直居中 */
    border-radius: 50%;
    cursor: pointer;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    transition: all 0.3s ease;
    background: linear-gradient(75deg, #615ced -8%, #3e2fa7 181%);
    color: #fff;
  }
  .side--control:hover {
    background-color: darkblue;
  }
`;

// 将CSS规则设置到<style>元素的内容中
styleElement.type = 'text/css';
if (styleElement.styleSheet) {
  // 对于IE浏览器
  styleElement.styleSheet.cssText = cssRules;
} else {
  // 对于其他浏览器
  styleElement.appendChild(document.createTextNode(cssRules));
}

// 将<style>元素添加到<head>中
document.head.appendChild(styleElement);

// 接下来的代码与之前相同，创建新的DIV并添加点击事件监听器
var newDiv = document.createElement('div');
newDiv.className = 'side--control';
newDiv.textContent = 'Toggle';
sideDiv.appendChild(newDiv);

// 隐藏侧边栏
function hideSide() {
  sideDiv.style.width = '0px'; // 设置宽度为0
  sideDiv.style.padding = "0";
  newDiv.style.left = "10px";
  sideDiv.setAttribute('data-hidden', 'true');
}

// 显示侧边栏
function showSide() {
  sideDiv.style.width = ''; // 恢复宽度
  sideDiv.style.padding = "";
  sideDiv.style.paddingTop = "20px";
  newDiv.style.left = "300px";
  sideDiv.setAttribute('data-hidden', 'false');
}

newDiv.addEventListener('click', function() {
  if (sideDiv.style.width === '0px') {
    showSide();
  } else {
    hideSide();
  }
});

// 添加点击事件监听器到整个文档
document.addEventListener('click', function(event) {
  // 检查点击的元素是否是sideDiv或控制按钮
  if (!sideDiv.contains(event.target) && !newDiv.contains(event.target)) {
    hideSide();
  }
});
