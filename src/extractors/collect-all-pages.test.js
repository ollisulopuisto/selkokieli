import assert from 'assert';
import cheerio from 'cheerio';
import Resource from 'resource';
import GenericExtractor from 'extractors/generic';
import collectAllPages from './collect-all-pages';

describe('collectAllPages', () => {
  it('does not fetch next_page_url if protocol is invalid or dangerous', async () => {
    let fetchCalled = false;
    const originalCreate = Resource.create;
    Resource.create = async url => {
      fetchCalled = true;
      return originalCreate(url);
    };

    try {
      const initialHtml = '<html><body><p>Page 1 content</p></body></html>';
      const $ = cheerio.load(initialHtml);
      const result = {
        title: 'Test Article',
        content: '<p>Page 1 content</p>',
      };

      const dangerousUrls = [
        'file:///etc/passwd',
        'ftp://example.com/page2',
        'javascript' + ':alert(1)', // eslint-disable-line no-useless-concat
        'data:text/html,malicious',
        '//relative-scheme.com/page2',
      ];

      await Promise.all(
        dangerousUrls.map(async dangerousUrl => {
          fetchCalled = false;
          const pageResult = await collectAllPages({
            next_page_url: dangerousUrl,
            html: initialHtml,
            $,
            metaCache: [],
            result: { ...result },
            Extractor: GenericExtractor,
            title: 'Test Article',
            url: 'http://example.com/page1',
          });

          assert.equal(
            fetchCalled,
            false,
            `Resource.create should not be called for dangerous URL: ${dangerousUrl}`
          );
          assert.equal(pageResult.total_pages, 1);
        })
      );
    } finally {
      Resource.create = originalCreate;
    }
  });
});
