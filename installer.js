// installer.js
const electronInstaller = require('electron-winstaller');

resultPromise = electronInstaller.createWindowsInstaller({
    appDirectory: './dist/Chat-Ver.test-win32-x64',
    outputDirectory: './dist',
    authors: 'MoGyeongTae',
    exe: 'ChatApp.exe'
  });

resultPromise.then(() => console.log("It worked!"), (e) => console.log(`No dice: ${e.message}`));
