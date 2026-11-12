import URL from 'url';
import { validateUrl } from 'utils';

// The legacy parser recovers a hostname even when the port is not a number
// (http://example.com:abc/), so check the authority's port here.
function hasValidPort(url) {
  const authority = /^[a-z][a-z0-9+.-]*:\/\/([^/?#]*)/i.exec(url);
  if (!authority) return false;

  const hostPort = authority[1].slice(authority[1].lastIndexOf('@') + 1);
  const port = /:([^:\]]*)$/.exec(hostPort);
  if (!port || port[1] === '') return true;

  return /^\d+$/.test(port[1]) && Number(port[1]) <= 65535;
}

export default function clean(leadImageUrl) {
  if (!leadImageUrl || typeof leadImageUrl !== 'string') return null;

  const trimmedUrl = leadImageUrl.trim();
  // Validate URL scheme and hostname to prevent returning dangerous protocols
  // (e.g. javascript:, file:, data:) or invalid URLs from untrusted document content
  let parsed;
  try {
    parsed = URL.parse(trimmedUrl);
  } catch (e) {
    // e.g. a malformed percent escape in userinfo: a bad image address must not
    // abort the whole article parse.
    return null;
  }

  if (validateUrl(parsed) && hasValidPort(trimmedUrl)) {
    return trimmedUrl;
  }

  return null;
}
