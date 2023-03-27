export default class LinkOpenerService {
  openLink(url: string): void {
    if (global.ipcRenderer && global.ipcRenderer.send)
      global.ipcRenderer.send('repositories', url);
  }
}
