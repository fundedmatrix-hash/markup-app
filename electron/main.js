const path = require('path');
const { app, BrowserWindow, ipcMain } = require('electron');

const createWindow = () => {
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 740,
    transparent: true,
    frame: false,
    alwaysOnTop: true,
    show: false,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      preload: path.join(__dirname, 'preload.js')
    }
  });

  mainWindow.loadURL('http://localhost:5173');
  mainWindow.once('ready-to-show', () => mainWindow.show());

  ipcMain.handle('markup:status', () => ({ ready: true, platform: 'desktop' }));
};

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
