# Sentinel's Journal

## 2026-11-04 - Unvalidated Canonical URL Extraction (Downstream XSS & Scheme Smuggling)
**Vulnerability:** `GenericUrlExtractor` extracted `<link rel="canonical" href="...">` and `<meta property="og:url" content="...">` directly from untrusted HTML documents without validating the scheme or hostname, allowing dangerous URIs like `javascript:`, `file:`, or `data:` to be propagated into the parser's returned `url` property with `domain: null`.
**Learning:** Downstream consumers (reading applications, share extensions, bookmarkers) frequently take the canonical `result.url` output and render it as clickable links or pass it to web views / HTTP clients assuming the parser only yields web URLs. Extractors that scrape URLs from HTML documents must validate URLs before setting them as canonical representations.
**Prevention:** Always validate extracted canonical or metadata URLs using `validateUrl(URL.parse(...))` and fall back to the safe, already-validated entry URL if the extracted candidate is invalid or dangerous.

## 2026-10-31 - Unvalidated Secondary Link Traversal (SSRF via Pagination)
**Vulnerability:** Secondary URLs discovered within parsed HTML documents (specifically `next_page_url` in `collectAllPages`) were fetched recursively via `Resource.create()` without being subject to the URL protocol validation enforced on the initial entry URL in `Parser.parse()`. Attackers could control the page content or custom extractors to emit dangerous schemes (such as `file://`, `ftp://`, or internal URLs) to trigger SSRF or protocol smuggling during pagination.
**Learning:** URL sanitization and validation must not be confined to external entry points; any secondary or discovered URLs extracted from untrusted payloads that are passed to HTTP/resource fetchers must be validated before issuing network or local filesystem requests.
**Prevention:** Always run `validateUrl()` on any parsed URL candidate before passing it to `Resource.create()` in recursive fetch routines like pagination crawlers.
