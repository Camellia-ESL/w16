import { app, BrowserWindow, ipcMain } from 'electron'
import { createRequire } from 'node:module'
import { fileURLToPath } from 'node:url'
import appConfig from './appConfig.json'
import path from 'node:path'
import * as fs from 'fs-extra';
import extract from 'extract-zip';

const require = createRequire(import.meta.url)
const __dirname = path.dirname(fileURLToPath(import.meta.url))

// The built directory structure
//
// ├─┬─┬ dist
// │ │ └── index.html
// │ │
// │ ├─┬ dist-electron
// │ │ ├── main.js
// │ │ └── preload.mjs
// │
process.env.APP_ROOT = path.join(__dirname, '..')

// 🚧 Use ['ENV_NAME'] avoid vite:define plugin - Vite@2.x
export const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL']
export const MAIN_DIST = path.join(process.env.APP_ROOT, 'dist-electron')
export const RENDERER_DIST = path.join(process.env.APP_ROOT, 'dist')

process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL ? path.join(process.env.APP_ROOT, 'public') : RENDERER_DIST

let win: BrowserWindow | null

function createWindow() {
  win = new BrowserWindow({
    width: 1080,
    height: 640,
    frame: false,
    icon: path.join(process.env.VITE_PUBLIC, 'electron-vite.svg'), // MODIFY WITH THE W16 ICON
    webPreferences: {
      preload: path.join(__dirname, 'preload.mjs'),
      contextIsolation: true,
    },
  })

  // Test active push message to Renderer-process.
  win.webContents.on('did-finish-load', () => {
    win?.webContents.send('main-process-message', (new Date).toLocaleString())
  })

  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL)
  } else {
    // win.loadFile('dist/index.html')
    win.loadFile(path.join(RENDERER_DIST, 'index.html'))
  }

  // Listen for window control IPC events
  ipcMain.on('window-control', (event, action) => {
    if (action === 'minimize' && win) {
      win.minimize();
    }
    if (action === 'close' && win) {
      win.close();
    }
  });

  // Open the DevTools automatically.
  if (appConfig.DevMode)
    win.webContents.openDevTools();
}

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
    win = null
  }
})

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

// Handle IPC request from renderer
ipcMain.handle('get-app-path', async () => {
  return app.getAppPath();
});

ipcMain.handle('write-file', async (e, data, filePath) => {
  try {
    fs.ensureDirSync(filePath.replace(/[^\/\\]*$/, ''));
    fs.writeFileSync(filePath, data instanceof ArrayBuffer ? Buffer.from(data) : data, 'utf8');
  } catch (err) {
    console.error('Error writing file:', err);
    return err;
  }
});

ipcMain.handle('read-file', async (e, filePath) => {
  try {
    return fs.readFileSync(filePath, 'utf8');
  } catch (err) {
    console.error('Error reading file:', err);
    return err;
  }
});

ipcMain.handle('unzip-file', async (e, filePath, destPath) => {
  try {
    await extract(filePath, { dir: destPath });
    fs.removeSync(filePath);
  } catch (err) {
    console.error('Error unzipping file:', err);
    return err;
  }
});

app.whenReady().then(createWindow)