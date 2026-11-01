# Sentinel's Journal

## 2026-10-31 - Unvalidated Secondary Link Traversal (SSRF via Pagination)
**Vulnerability:** Secondary URLs discovered within parsed HTML documents (specifically `next_page_url` in `collectAllPages`) were fetched recursively via `Resource.create()` without being subject to the URL protocol validation enforced on the initial entry URL in `Parser.parse()`. Attackers could control the page content or custom extractors to emit dangerous schemes (such as `file://`, `ftp://`, or internal URLs) to trigger SSRF or protocol smuggling during pagination.
**Learning:** URL sanitization and validation must not be confined to external entry points; any secondary or discovered URLs extracted from untrusted payloads that are passed to HTTP/resource fetchers must be validated before issuing network or local filesystem requests.
**Prevention:** Always run `validateUrl()` on any parsed URL candidate before passing it to `Resource.create()` in recursive fetch routines like pagination crawlers.
