import URL from 'url';
import { validateUrl } from 'utils';

export default function clean(leadImageUrl) {
  if (!leadImageUrl || typeof leadImageUrl !== 'string') return null;

  const trimmedUrl = leadImageUrl.trim();
  // Validate URL scheme and hostname to prevent returning dangerous protocols
  // (e.g. javascript:, file:, data:) or invalid URLs from untrusted document content
  const parsed = URL.parse(trimmedUrl);
  if (validateUrl(parsed)) {
    return trimmedUrl;
  }

  return null;
}
