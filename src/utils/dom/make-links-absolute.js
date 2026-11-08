import URL from 'url';

import { validateUrl } from 'utils';
import { getAttrs, setAttr } from 'utils/dom';

function getSafeBaseUrl($, rootUrl) {
  const candidateBaseUrl = $('base').attr('href');
  if (candidateBaseUrl) {
    // Validate baseUrl scheme and hostname to prevent using dangerous protocols
    // (e.g. javascript:, file:, data:) or invalid URLs from untrusted documents
    const parsed = URL.parse(candidateBaseUrl);
    if (validateUrl(parsed)) {
      return candidateBaseUrl;
    }
  }

  return rootUrl;
}

function absolutize($, baseUrl, attr) {
  $(`[${attr}]`).each((_, node) => {
    const attrs = getAttrs(node);
    const url = attrs[attr];
    if (!url) return;
    const absoluteUrl = URL.resolve(baseUrl, url);

    setAttr(node, attr, absoluteUrl);
  });
}

function absolutizeSet($, baseUrl, $content) {
  $('[srcset]', $content).each((_, node) => {
    const attrs = getAttrs(node);
    const urlSet = attrs.srcset;

    if (urlSet) {
      // a comma should be considered part of the candidate URL unless preceded by a descriptor
      // descriptors can only contain positive numbers followed immediately by either 'w' or 'x'
      // space characters inside the URL should be encoded (%20 or +)
      const candidates = urlSet.match(
        /(?:\s*)(\S+(?:\s*[\d.]+[wx])?)(?:\s*,\s*)?/g
      );
      if (!candidates) return;
      const absoluteCandidates = candidates.map(candidate => {
        // a candidate URL cannot start or end with a comma
        // descriptors are separated from the URLs by unescaped whitespace
        const parts = candidate
          .trim()
          .replace(/,$/, '')
          .split(/\s+/);
        parts[0] = URL.resolve(baseUrl, parts[0]);
        return parts.join(' ');
      });
      const absoluteUrlSet = [...new Set(absoluteCandidates)].join(', ');
      setAttr(node, 'srcset', absoluteUrlSet);
    }
  });
}

export default function makeLinksAbsolute($content, $, url) {
  const baseUrl = getSafeBaseUrl($, url);

  ['href', 'src'].forEach(attr => absolutize($, baseUrl, attr));
  absolutizeSet($, baseUrl, $content);

  return $content;
}
