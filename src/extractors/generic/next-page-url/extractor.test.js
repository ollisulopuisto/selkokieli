import assert from 'assert';
import cheerio from 'cheerio';

import GenericNextPageUrlExtractor from './extractor';

const fs = require('fs');

describe('GenericNextPageUrlExtractor', () => {
  it('returns most likely next page url', () => {
    const html = fs.readFileSync('./fixtures/arstechnica.com.html', 'utf8');
    const $ = cheerio.load(html);
    const url =
      'https://arstechnica.com/gadgets/2016/08/the-connected-renter-how-to-make-your-apartment-smarter/';
    const next =
      'https://arstechnica.com/gadgets/2016/08/the-connected-renter-how-to-make-your-apartment-smarter/2';

    const nextPage = GenericNextPageUrlExtractor.extract({
      $,
      url,
    });

    assert.equal(nextPage, next);
  });

  it('returns null if there is no likely next page', () => {
    const html = '<div><p>HI</p></div>';
    const $ = cheerio.load(html);
    const url = 'http://example.com/foo/bar';

    const nextPage = GenericNextPageUrlExtractor.extract({
      $,
      url,
    });

    assert.equal(nextPage, null);
  });

  it('rejects dangerous next page URL protocols', () => {
    const url = 'http://example.com/blog/story';
    const dangerousLinks = [
      'javascript' + ':alert(1)', // eslint-disable-line no-script-url, no-useless-concat
      'file:///etc/passwd2',
      'ftp://example.com/blog/story/2',
      'data:text/html,2',
    ];

    dangerousLinks.forEach(dangerousHref => {
      const html = `
        <div>
          <a href="${dangerousHref}" class="next-page">Next Page 2</a>
        </div>
      `;
      const $ = cheerio.load(html);
      const nextPage = GenericNextPageUrlExtractor.extract({
        $,
        url,
      });

      assert.equal(nextPage, null);
    });
  });
});
