const fs  = require('fs')
const os = require('os')
const path = require('path')
const { exec } = require('child_process');

const { app, BrowserWindow, ipcMain, Tray, Menu, globalShortcut, screen } = require('electron')

const loadPlugins = require('./load_plugins')
pluginsCode = loadPlugins();

const isDebug = process.argv.some(arg => arg.includes('--inspect'));
const isDev = process.argv.some(arg => arg.includes('--dev'));
let win = null

function createWindow () {
  // 获取屏幕尺寸信息
  const screenSize = screen.getPrimaryDisplay().size;
  const width = screenSize.width;
  const height = screenSize.height;

  let win = new BrowserWindow({
    width: 752, // 设置窗口宽度为800像素
    height: height, // 设置窗口高度占满屏幕高度
    x: width - 752, // 计算窗口在桌面上的初始x坐标
    y: 0, // 设置窗口在桌面上的初始y坐标
    resizable: false,
    titleBarStyle: 'hiddenInset', // macOS 上可以使用此选项以隐藏菜单栏但保留自定义标题栏
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true
    }
  })

  // 在Windows/Linux系统上，通常没有内置的方式来只隐藏菜单栏而不隐藏整个标题栏。
  // 你需要手动处理窗口标题栏的样式（例如使用CSS）并在Electron主进程中禁用或自定义菜单。
  if (process.platform === 'win32' || process.platform === 'linux') {
    // 禁用默认菜单
    win.setMenu(null)
  }

  win.loadURL('https://tongyi.aliyun.com/qianwen/') // 加载你的网址

  // 监听加载完成事件
  win.webContents.on('did-finish-load', () => {
    if (isDebug) {
      win.webContents.openDevTools(); // 启动 div Tools
      console.log(pluginsCode) // 打印 所有插件的源代码
    }
    win.webContents.executeJavaScript(pluginsCode);
  });

  return win;
}

function createTray() {
  // 创建托盘图标
  let iconPath = process.platform === 'win32' ? path.join(process.resourcesPath, 'assets/icons/win/logo.ico') : path.join(process.resourcesPath, 'assets/icons/win/1024x1024.png');
  if (isDev) {
    iconPath = process.platform === 'win32' ? 'src/assets/icons/win/logo.ico' : 'src/assets/icons/png/1024x1024.png';
  }
  tray = new Tray(iconPath);

  const createTrayMenu = () => {
    operationWindowText = win.isVisible() ? "隐藏窗口" : "显示窗口"
    // 创建上下文菜单
    const contextMenu = Menu.buildFromTemplate([
      { label: operationWindowText, click: () => win.isVisible() ? win.hide() : win.show() },
      { label: '退出', click: () => app.quit() }
    ]);

    // 设置托盘图标的上下文菜单
    tray.setContextMenu(contextMenu);
  }

  win.on('show', createTrayMenu);
  win.on('hide', createTrayMenu);
  createTrayMenu()

  // 监听托盘图标的双击事件
  tray.on('double-click', () => {
    if (win.isVisible()) {
      win.hide();
    } else {
      win.show();
    }
  });
}

// 生成一个随机文件名
function generateRandomFileName(lang) {
  let extensionName = 'txt'
  switch(lang) {
    case 'Python':
      extensionName = 'py'
      break
    case 'Html':
      extensionName = 'html'
      break
    case 'Javascript':
      extensionName = 'js'
      break
  }
  return Math.random().toString(36).substring(2, 10) + '.' + extensionName // 这里生成的是一个随机的8位字符串加.txt扩展名
}

// 将需要执行的代码写入临时文件
function writeTempFile(codeString, lang) {
  const tempDir = os.tmpdir()
  const filePath = path.join(tempDir, generateRandomFileName(lang))
  fs.writeFileSync(filePath, codeString, 'utf8')
  return filePath
}

app.whenReady().then(() => {
  win = createWindow();
  createTray();

  // 注册全局热键 Ctrl+Z+空格
  const accelerator = 'Ctrl+Z+Space';
  globalShortcut.register(accelerator, () => {
    win.isVisible() ? win.hide() : win.show();
  });

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})

ipcMain.on('eval-code', (event, code, lang) => {
  const evalFilePath = writeTempFile(code, lang)
  console.log('evalFilePath:', evalFilePath)
  switch(lang) {
    case 'Python':
      exec(`start cmd /K "echo. && echo 【通义千问桌面端提醒】你即将执行 ${evalFilePath} && echo. && python \"${evalFilePath}\""`, () => {
        fs.unlink(evalFilePath, () => {})
      })
      break
    case 'Html':
      exec(`start "" "${evalFilePath}"`, () => {})
      break
    case 'Javascript':
      exec(`start cmd /K "echo. && echo 【通义千问桌面端提醒】你即将执行 ${evalFilePath} && echo. && node \"${evalFilePath}\""`, () => {
        fs.unlink(evalFilePath, () => {})
      })
      break
  }
})
