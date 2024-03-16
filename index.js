const { app, BrowserWindow, Menu } = require('electron');

const createWindow = () => {
    const win = new BrowserWindow({
        width: 1200,
        height: 1000,
    });

    win.loadFile('index.html');
};

app.whenReady().then(() => {
    Menu.setApplicationMenu(null); // 隐藏菜单栏
    createWindow();
});
