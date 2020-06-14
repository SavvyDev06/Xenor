const { app, BrowserWindow } = require('electron');
const path = require('path');

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
  app.quit();
}

let appVersion = 0.23;

const isDev = require('electron-is-dev');

//const { autoUpdater, dialog } = require('electron');

require('update-electron-app')({
  //repo: 'SavvyDev06/Xenor',
  updateInterval: '5 minutes'
})

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 1000,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
    }
  });

  // and load the index.html of the app.
  mainWindow.loadFile(path.join(__dirname, 'index.html'));

  // Open the DevTools.
  mainWindow.webContents.openDevTools();                                                     //Uncomment to re-enable dev tools!!!!!!!!
};

// This method will be called when Electron has finished
// Initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

console.log('App Version ' + appVersion);

//Auto-updating Goodness
if (isDev) {
	console.log('Running in development m8, enjoy coding :) => v' + appVersion);
}
else {
  /*
  console.log('Running in production, checking for updates');
  const server = "https://xenor-server.now.sh"
  const feed = `${server}/update/${process.platform}/${app.getVersion()}`

  autoUpdater.setFeedURL(feed)
  
  setInterval(() => {
    autoUpdater.checkForUpdates()
  }, 60000)
  */
  
}

/*
autoUpdater.on('update-downloaded', (event, releaseNotes, releaseName) => {
  const dialogOpts = {
    type: 'info',
    buttons: ['Restart', 'Later'],
    title: 'Application Update',
    message: process.platform === 'win32' ? releaseNotes : releaseName,
    detail: 'A new Xenor version has been downloaded. Restart the application to apply the updates :D'
  }

  dialog.showMessageBox(dialogOpts).then((returnValue) => {
    if (returnValue.response === 0) autoUpdater.quitAndInstall()
  })
})
autoUpdater.on('error', message => {
  console.error('There was a problem updating the application. Please contact me on Discord at SavvyDev06#4043.')
  console.error(message)
})
*/

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
