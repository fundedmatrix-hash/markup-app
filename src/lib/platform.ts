export type PlatformName = 'web' | 'desktop' | 'mobile' | 'tablet' | 'extension';

export type CapabilityReport = {
  platform: PlatformName;
  browser: 'chrome' | 'edge' | 'firefox' | 'safari' | 'unknown';
  isMobile: boolean;
  isTablet: boolean;
  supportsOverlay: boolean;
  supportsScreenCapture: boolean;
  supportsRecording: boolean;
  supportsDrive: boolean;
  supportsPwa: boolean;
  supportsSystemOverlay: boolean;
};

export function detectPlatform(): CapabilityReport {
  const ua = navigator.userAgent.toLowerCase();

  const isAndroid = /android/.test(ua);
  const isIOS = /iphone|ipad|ipod/.test(ua);
  const isMobile = isAndroid || isIOS || /mobile/.test(ua);
  const isTablet = /(ipad|tablet|playbook|silk)/.test(ua) || (isAndroid && !/mobile/.test(ua));
  const isChrome = /chrome/.test(ua) && !/edg|opr\//.test(ua);
  const isEdge = /edg\//.test(ua);
  const isFirefox = /firefox/.test(ua);
  const isSafari = /safari/.test(ua) && !isChrome && !isFirefox && !isEdge;

  const supportsScreenCapture = !!navigator.mediaDevices?.getDisplayMedia;
  const supportsRecording = typeof MediaRecorder !== 'undefined';
  const supportsPwa = 'serviceWorker' in navigator && 'indexedDB' in window;
  const supportsSystemOverlay = !(isIOS || isMobile) && !isFirefox;

  const platform: PlatformName = isMobile ? 'mobile' : isTablet ? 'tablet' : 'web';

  return {
    platform,
    browser: isEdge ? 'edge' : isChrome ? 'chrome' : isFirefox ? 'firefox' : isSafari ? 'safari' : 'unknown',
    isMobile,
    isTablet,
    supportsOverlay: supportsScreenCapture,
    supportsScreenCapture,
    supportsRecording,
    supportsDrive: true,
    supportsPwa,
    supportsSystemOverlay
  };
}

export function getSupportLabel(report: CapabilityReport) {
  if (report.platform === 'mobile' && !report.supportsSystemOverlay) {
    return 'Mobile overlay unavailable. Using supported capture and annotation alternatives.';
  }

  if (report.browser === 'firefox' && !report.supportsSystemOverlay) {
    return 'Firefox supports a constrained overlay experience; use screen capture where possible.';
  }

  return 'Platform supports the close-to-native MARKUP workflow.';
}
