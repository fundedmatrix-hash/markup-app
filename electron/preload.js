const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('markupBridge', {
  status: () => ipcRenderer.invoke('markup:status'),
  capture: () => ipcRenderer.invoke('markup:capture')
});
