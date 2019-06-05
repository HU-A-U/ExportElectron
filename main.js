const electron = require('electron')
const { webContents } = require('electron')
const BrowserWindow = electron.BrowserWindow
const Menu = electron.Menu
const app = electron.app
// 保持对window对象的全局引用，如果不这么做的话，当JavaScript对象被
// 垃圾回收的时候，window对象将会自动的关闭
let win
let mainWindow;
let template = [
    {
        label: '编辑',
        submenu:
        [{
                label: '撤销',
                accelerator: 'CmdOrCtrl+Z',
                role: 'undo'
            }, {
                label: '剪切',
                accelerator: 'CmdOrCtrl+X',
                role: 'cut'
            }, {
                label: '复制',
                accelerator: 'CmdOrCtrl+C',
                role: 'copy'
            }, {
                label: '粘贴',
                accelerator: 'CmdOrCtrl+V',
                role: 'paste'
            }, {
                label: '全选',
                accelerator: 'CmdOrCtrl+A',
                role: 'selectall'
        }]
    },
    {
        label: '调试',
        accelerator: (function() {
            if (process.platform === 'darwin') {
                return 'Alt+Command+I'
            } else {
                return 'Ctrl+Shift+I'
            }
        })(),
        click: function(item, focusedWindow) {
            if (focusedWindow) {
                focusedWindow.toggleDevTools()
            }
        }
    },
    {
        label: '刷新',
        accelerator: 'F5',
            click: function(item, focusedWindow) {
                if (focusedWindow) {
                    // 重载之后, 刷新并关闭所有的次要窗体
                    if (focusedWindow.id === 1) {
                        BrowserWindow.getAllWindows().forEach(function(win) {
                            if (win.id > 1) {
                                win.close()
                            }
                        })
                    }
                    focusedWindow.reload()
                }
            }
    },
    {
        label: '开始导出',
        click: function(item, focusedWindow) {
            if (focusedWindow) {
                contents = focusedWindow.webContents;
                // contents.executeJavaScript('fetch("https://jsonplaceholder.typicode.com/users/1").then(resp => resp.json())', true)
                //   .then((result) => {
                //     console.log(result) // Will be the JSON object from the fetch call
                //   })
                res = contents.executeJavaScript('export_yiqidai()'); //.then((res) => {console.log(res)} )
                console.log(res)
                console.log(res.contents)
            }
        }
    }
];


function findReopenMenuItem() {
    const menu = Menu.getApplicationMenu()
    if (!menu) return

    let reopenMenuItem
    menu.items.forEach(function(item) {
        if (item.submenu) {
            item.submenu.items.forEach(function(item) {
                if (item.key === 'reopenMenuItem') {
                    reopenMenuItem = item
                }
            })
        }
    })
    return reopenMenuItem
}


if (process.platform === 'win32') {
    const helpMenu = template[template.length - 1].submenu
}
app.commandLine.appendSwitch("--disable-http-cache")
app.on('ready', function() {
    const menu = Menu.buildFromTemplate(template)
    Menu.setApplicationMenu(menu)
    createWindow()
})

app.on('browser-window-created', function() {
    let reopenMenuItem = findReopenMenuItem()
    if (reopenMenuItem) reopenMenuItem.enabled = false
})

app.on('window-all-closed', function() {
    let reopenMenuItem = findReopenMenuItem()
    if (reopenMenuItem) reopenMenuItem.enabled = true
})

function createWindow() {
    // 创建浏览器窗口。
    win = new BrowserWindow({
        width: 1200,
        height: 750, title: '账套导出', icon: 'ico.ico',
        webPreferences: { webSecurity: false}});
    //加载进度条
    // win.setProgressBar(0.8);
    //最大化窗口
    //win.maximize()
    // 然后加载应用的 index.html。
    // win.loadFile('index.html');

    win.loadURL("https://17dz.com/home/login.html"); //亿企贷

    // 打开开发者工具
    // win.webContents.openDevTools();

    // 当 window 被关闭，这个事件会被触发。
    win.on('closed', () => {
        // 取消引用 window 对象，如果你的应用支持多窗口的话，
        // 通常会把多个 window 对象存放在一个数组里面，
        // 与此同时，你应该删除相应的元素。
        win = null
    });

    win.webContents.on('did-finish-load',() => {
        //将js加载进页面
        win.webContents.executeJavaScript(
            'var head = document.getElementsByTagName("head")[0];'+
            'var script = document.createElement("script");' +
            'script.type = "text/javascript";'+
            'script.src = "http://116.228.76.162:5008/static/export_yiqidai.js";'+
            'head.appendChild(script);'
        )
    })
}
// app.commandLine.appendSwitch('proxy-server', '116.228.76.168:8888');
// app.commandLine.appendSwitch('proxy-bypass-list', '116.228.76.169;zwdtuser.sh.gov.cn;zwdt.sh.gov.cn;api.eshimin.com;login.gjzwfw.gov.cn');
// app.commandLine.appendSwitch('host-rules', 'MAP yct.sh.gov.cn proxy');
// Electron 会在初始化后并准备
// 创建浏览器窗口时，调用这个函数。
// 部分 API 在 ready 事件触发后才能使用。

// 当全部窗口关闭时退出。
app.on('window-all-closed', () => {
    // 在 macOS 上，除非用户用 Cmd + Q 确定地退出，
    // 否则绝大部分应用及其菜单栏会保持激活。
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', () => {
    // 在macOS上，当单击dock图标并且没有其他窗口打开时，
    // 通常在应用程序中重新创建一个窗口。
    if (win === null) {
        createWindow()
    }
});

function f() {

}