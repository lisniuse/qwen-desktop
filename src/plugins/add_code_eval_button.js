// 接下来的代码与之前相同，创建新的DIV并添加点击事件监听器
var codeBlocks = document.getElementsByClassName('tongyi-ui-highlighter-header');

const EVEAL_WHITE_LIST = [ "Html", "Python", "Javascript" ];

// 模拟 setInterval 解决溢出问题
function repeatedTimeout(callback, interval) {
  function wrapper() {
    callback();
    // 在回调函数执行完毕后，立即再次设置 setTimeout，从而实现周期性执行的效果
    setTimeout(wrapper, interval);
  }

  // 首次启动定时器
  setTimeout(wrapper, interval);

  // 返回一个用于清除定时器的函数（需要保存定时器id）
  let timerId;
  return {
    clear: function() {
      clearTimeout(timerId);
    }
  };
}

function onButtonClick() {
  var parentElement = this.parentNode;
  var firstChildNode = parentElement.firstChild;
  var lang = firstChildNode.innerText;
  if (EVEAL_WHITE_LIST.includes(lang)) {
    var codeString = this.parentNode.parentNode.children[1].innerText;
    var cleanedCode = codeString.replace(/^[0-9]+/gm, '');
    window.electronAPI.evalCode(cleanedCode, lang);
  }
}

function createButtonStyle() {
  var styleElement = document.createElement('style');
  var cssRules = `
    .qwen-desktop-eval-button:hover {
      border-color: #615ced !important;
      color: #615ced;
    }
  `;
  styleElement.type = 'text/css';
  styleElement.appendChild(document.createTextNode(cssRules));
  document.head.appendChild(styleElement);
}

function createButton(parentNode) {
  var buttonDiv = document.createElement('div');
  buttonDiv.textContent = '执行';
  buttonDiv.className = 'qwen-desktop-eval-button';
  buttonDiv.style.padding = '2px 12px 2px 12px';
  buttonDiv.style.marginLeft = '10px';
  buttonDiv.style.border = "1px solid #d3d6e7";
  buttonDiv.style.borderRadius = "16px";
  buttonDiv.style.fontSize = '12px';
  buttonDiv.style.cursor = "pointer";
  buttonDiv.onclick = onButtonClick;
  parentNode.appendChild(buttonDiv);
  return buttonDiv;
}

createButtonStyle();

const interval = repeatedTimeout(function() {
  Array.from(codeBlocks).forEach(item => {
    var childButtons = item.querySelectorAll('.qwen-desktop-eval-button');
    if (childButtons.length == 0) {
      let buttonDiv = createButton(item);
    }
  });
}, 1000);
