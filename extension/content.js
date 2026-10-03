const MARKUP_MESSAGE = 'markup:toggle-overlay';

window.addEventListener('message', (event) => {
  if (event.data?.type === 'markup:overlay-request') {
    chrome.runtime.sendMessage({ type: 'markup:toggle' });
  }
});

const overlay = document.createElement('div');
overlay.id = 'markup-overlay';
overlay.style.position = 'fixed';
overlay.style.left = '0';
overlay.style.top = '0';
overlay.style.width = '100vw';
overlay.style.height = '100vh';
overlay.style.pointerEvents = 'none';
overlay.style.zIndex = '2147483647';
overlay.style.display = 'none';
overlay.style.background = 'rgba(15, 23, 42, 0.08)';
outlet();

function outlet() {
  document.body.appendChild(overlay);
  const style = document.createElement('style');
  style.textContent = '#markup-overlay { border: 1px solid rgba(249,115,22,0.6); border-radius: 16px; }';
  document.head.appendChild(style);
}

window.addEventListener(MARKUP_MESSAGE, () => {
  overlay.style.display = overlay.style.display === 'none' ? 'block' : 'none';
});
