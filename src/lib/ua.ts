// Lightweight user-agent parsing: enough for device / browser / OS breakdowns, and bot filtering.

export const BOT_RE = /bot|crawl|spider|slurp|facebookexternalhit|embedly|preview|headless|lighthouse|pagespeed|pingdom|uptime|monitor|curl|wget|python|httpclient|axios|node-fetch|go-http|java\/|scrapy|phantom|puppeteer|playwright|selenium/i;
export const isBot = (ua: string) => !ua || BOT_RE.test(ua);

export function parseUa(ua: string, screenW?: number | null) {
  const browser =
    /Edg\//.test(ua) ? 'Edge'
    : /OPR\/|Opera/.test(ua) ? 'Opera'
    : /SamsungBrowser/.test(ua) ? 'Samsung Internet'
    : /Firefox\/|FxiOS/.test(ua) ? 'Firefox'
    : /CriOS|Chrome\//.test(ua) ? 'Chrome'
    : /Safari\//.test(ua) ? 'Safari'
    : 'Other';
  const os =
    /iPhone|iPad|iPod/.test(ua) ? 'iOS'
    : /Android/.test(ua) ? 'Android'
    : /Mac OS X|Macintosh/.test(ua) ? 'macOS'
    : /Windows/.test(ua) ? 'Windows'
    : /CrOS/.test(ua) ? 'ChromeOS'
    : /Linux/.test(ua) ? 'Linux'
    : 'Other';
  const device =
    /iPad|Tablet/.test(ua) || (/Android/.test(ua) && !/Mobile/.test(ua)) ? 'Tablet'
    : /Mobi|iPhone|iPod|Android/.test(ua) ? 'Mobile'
    : screenW && screenW < 768 ? 'Mobile'
    : 'Desktop';
  return { browser, os, device };
}
