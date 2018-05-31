const electron = require("electron");
const notifier = require('electron-notification-desktop')
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
var mainWindow = null;

app.on("window-all-closed",function(){
  if(process.platform != "darwin") {
    app.quit();
  }
})

app.on("ready",function() {
  mainWindow = new BrowserWindow({width : 1000, height : 700});

  mainWindow.loadURL('file://' + __dirname + "/index.html");

  // mainWindow.webContents.openDevTools()
  mainWindow.on("closed",function() {
    mainWindow = null;
  })
})
