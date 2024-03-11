const { app, BrowserWindow, Tray, Menu, globalShortcut, screen } = require('electron')

const path = require('path');
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
