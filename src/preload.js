const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
  evalCode: (code, lang) => {
    ipcRenderer.send('eval-code', code, lang);
  }
});
