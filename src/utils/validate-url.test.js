import assert from 'assert';
import URL from 'url';

import validateUrl from './validate-url';

describe('validateUrl(parsedUrl)', () => {
  it('returns false if url has no scheme', () => {
    const url = URL.parse('example.com');
    const valid = validateUrl(url);

    assert.equal(valid, false);
  });

  it('returns false if url is undefined or empty', () => {
    assert.equal(validateUrl(), false);
    assert.equal(validateUrl({}), false);
  });

  it('returns false for protocol-relative url with no scheme', () => {
    const url = URL.parse('//example.com');
    const valid = validateUrl(url);

    assert.equal(valid, false);
  });

  it('returns false for unsupported or dangerous protocols', () => {
    const fileUrl = URL.parse('file:///etc/passwd');
    const ftpUrl = URL.parse('ftp://example.com');
    const jsUrl = URL.parse('javascript' + ':alert(1)'); // eslint-disable-line no-useless-concat
    const dataUrl = URL.parse('data:text/html,test');

    assert.equal(validateUrl(fileUrl), false);
    assert.equal(validateUrl(ftpUrl), false);
    assert.equal(validateUrl(jsUrl), false);
    assert.equal(validateUrl(dataUrl), false);
  });

  it('returns true if url is valid http or https', () => {
    const httpUrl = URL.parse('http://example.com');
    const httpsUrl = URL.parse('https://example.com/some/path?query=param');
    const upperHttpUrl = { protocol: 'HTTP:', hostname: 'example.com' };
    const upperHttpsUrl = { protocol: 'HTTPS:', hostname: 'example.com' };

    assert.equal(validateUrl(httpUrl), true);
    assert.equal(validateUrl(httpsUrl), true);
    assert.equal(validateUrl(upperHttpUrl), true);
    assert.equal(validateUrl(upperHttpsUrl), true);
  });
});
