import URL from 'url';

import { validateUrl } from 'utils';
import { KEEP_SELECTORS, KEEP_CLASS } from './constants';

export default function markToKeep(article, $, url, tags = []) {
  if (tags.length === 0) {
    tags = KEEP_SELECTORS;
  }

  if (url) {
    const parsed = URL.parse(url);
    if (validateUrl(parsed)) {
      const { protocol, hostname } = parsed;
      tags = [...tags, `iframe[src^="${protocol}//${hostname}"]`];
    }
  }

  $(tags.join(','), article).addClass(KEEP_CLASS);

  return $;
}
