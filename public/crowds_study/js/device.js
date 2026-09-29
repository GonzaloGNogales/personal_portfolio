// Best-effort description of the participant's device, saved with the session.
// Browsers expose the operating system and whether the device is a phone/tablet, but
// NOT whether a computer is a laptop or a desktop, so deviceType is phone, tablet or
// computer. The raw user agent is saved as well, so this can be re-checked later.

function detectOs(ua) {
  const hinted = navigator.userAgentData?.platform;
  if (hinted) {
    if (/windows/i.test(hinted)) return 'Windows';
    if (/mac/i.test(hinted)) return 'macOS';
    if (/android/i.test(hinted)) return 'Android';
    if (/chrome ?os/i.test(hinted)) return 'ChromeOS';
    if (/linux/i.test(hinted)) return 'Linux';
    if (/ios/i.test(hinted)) return 'iOS';
  }
  if (/iphone|ipod/i.test(ua)) return 'iOS';
  if (/ipad/i.test(ua)) return 'iPadOS';
  // iPads with desktop-class Safari report themselves as a Mac; touch gives them away.
  if (/macintosh|mac os x/i.test(ua)) return navigator.maxTouchPoints > 1 ? 'iPadOS' : 'macOS';
  if (/android/i.test(ua)) return 'Android';
  if (/cros/i.test(ua)) return 'ChromeOS';
  if (/windows/i.test(ua)) return 'Windows';
  if (/linux|x11/i.test(ua)) return 'Linux';
  return 'Other';
}

function detectDeviceType(ua, os) {
  if (navigator.userAgentData?.mobile) return 'phone';
  if (os === 'iOS') return 'phone';
  if (os === 'iPadOS' || /tablet/i.test(ua)) return 'tablet';
  // Android phones include "Mobile" in the user agent; Android tablets do not.
  if (os === 'Android') return /mobile/i.test(ua) ? 'phone' : 'tablet';
  return 'computer';
}

function detectBrowser(ua) {
  if (/edg\//i.test(ua)) return 'Edge';
  if (/opr\/|opera/i.test(ua)) return 'Opera';
  if (/samsungbrowser/i.test(ua)) return 'Samsung Internet';
  if (/firefox|fxios/i.test(ua)) return 'Firefox';
  if (/chrome|crios|chromium/i.test(ua)) return 'Chrome';
  if (/safari/i.test(ua)) return 'Safari';
  return 'Other';
}

export function detectDevice() {
  const ua = navigator.userAgent;
  const os = detectOs(ua);
  return {
    os,
    deviceType: detectDeviceType(ua, os),
    browser: detectBrowser(ua),
    touch: navigator.maxTouchPoints > 0
  };
}
