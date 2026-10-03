chrome.runtime.onInstalled.addListener(() => {
  console.info('MARKUP extension installed');
});

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message?.type === 'markup:toggle') {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const tab = tabs[0];
      if (!tab?.id) return;
      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: () => {
          window.dispatchEvent(new CustomEvent('markup:toggle-overlay', { detail: { enabled: true } }));
        }
      });
    });
    sendResponse({ ok: true });
  }
  return true;
});
