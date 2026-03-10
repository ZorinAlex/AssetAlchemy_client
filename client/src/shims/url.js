// Browser shim for Node.js 'url' module
// Used by @pixi/utils which imports url.parse/format/resolve (deprecated in pixi 7.3+)

export const parse = (urlString) => {
  try {
    const u = new URL(urlString);
    return {
      href: u.href, protocol: u.protocol, host: u.host,
      hostname: u.hostname, port: u.port, pathname: u.pathname,
      search: u.search, hash: u.hash, auth: null, path: u.pathname + u.search,
    };
  } catch { return {}; }
};

export const format = (obj) => {
  if (typeof obj === 'string') return obj;
  return obj?.href ?? '';
};

export const resolve = (from, to) => {
  try { return new URL(to, from).href; } catch { return to; }
};

export default { parse, format, resolve };
