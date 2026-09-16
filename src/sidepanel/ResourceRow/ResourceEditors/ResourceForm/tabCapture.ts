/** Why This tab can’t capture this URL, or null if it can. */
export function tabCaptureHint(url: string | undefined): string | null {
  if (url === undefined || url === '') {
    return "Can't use this page.";
  }
  if (url.startsWith('chrome://') || url.startsWith('chrome-extension://')) {
    return "Can't use this page.";
  }
  if (isChromeWebStore(url)) {
    return "Can't use this page.";
  }
  if (!url.startsWith('https://')) {
    return 'URL must start with https://';
  }
  return null;
}

function isChromeWebStore(url: string): boolean {
  try {
    const { hostname, pathname } = new URL(url);
    if (hostname === 'chromewebstore.google.com') {
      return true;
    }
    return hostname === 'chrome.google.com' && pathname.startsWith('/webstore');
  } catch {
    return false;
  }
}

export async function readActiveTab(): Promise<{ title: string; url: string } | null> {
  const tabs = await chrome.tabs.query({ active: true, lastFocusedWindow: true });
  const tab = tabs[0];
  if (tab === undefined || tab.url === undefined) {
    return null;
  }
  return { title: tab.title ?? '', url: tab.url };
}
