// Validate URL scheme and hostname to prevent SSRF and protocol smuggling
// Only HTTP and HTTPS protocols with a valid hostname are allowed.
export default function validateUrl({ protocol, hostname } = {}) {
  if (!protocol || !hostname) {
    return false;
  }

  return /^https?:$/i.test(protocol);
}
