import { HandledRoute, registerPlugin } from '@scullyio/scully';
import RssParser from 'rss-parser';
import { stripHtml } from 'string-strip-html';

interface DevCommunityRssFeed {
  readonly language: string;
}
interface DevCommunityRssItem {
  readonly description: string;
}

const rssParser = new RssParser<DevCommunityRssFeed, DevCommunityRssItem>({
  customFields: {
    feed: ['language'],
    item: ['description'],
  },
});

export const fromRss = 'tilFromRss';

interface FromRssOptions {
  readonly rss: string;
}

async function fromRssPlugin(
  route: string,
  options: FromRssOptions
): Promise<HandledRoute[]> {
  const feed = await rssParser.parseURL(options.rss);
  const items = feed.items.map((article) => ({
    ...article,
    description:
      stripHtml(article.description).result.substr(0, 255) + ' (...)',
  }));

  return [
    {
      route,
      data: {
        items,
      },
    },
  ];
}

const validator = async () => [];

registerPlugin('router', fromRss, fromRssPlugin, validator);