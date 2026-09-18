export type TabInfo = {
  done: boolean;
  title: string | null;
  url: string | null;
  /** Why capture failed; null when `done` is true. */
  reason: string | null;
};

/** Active tab title/URL plus whether it can be captured like This tab. */
export async function readActiveTab(): Promise<TabInfo> {
  const tabs = await chrome.tabs.query({ active: true, lastFocusedWindow: true });
  const tab = tabs[0];
  const title = normalize(tab?.title);
  const url = normalize(tab?.url);

  if (url === null) {
    return { done: false, title, url: null, reason: "Can't use this page." };
  }

  const reason = captureBlockReason(url);
  if (reason !== null) {
    return { done: false, title, url, reason };
  }

  return { done: true, title, url, reason: null };
}

function normalize(value: string | undefined): string | null {
  const trimmed = (value ?? '').trim();
  return trimmed === '' ? null : trimmed;
}

function captureBlockReason(url: string): string | null {
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
