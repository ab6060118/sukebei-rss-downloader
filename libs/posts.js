import Parser from 'rss-parser';
import Crawler from 'crawler';
import config from '../config';
import { login, createFolder, download } from './nas_util';
import ErrorCode from '../error_code';

const parser = new Parser({
  customFields: {
    item: [
      ['nyaa:size', 'size'],
      ['nyaa:infoHash', 'hash'],
    ],
  },
});

const crawler = new Crawler({
  maxConnections: 100,
  userAgent: 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/76.0.3809.87 Safari/537.36',
});

const getFc2Img = (number) => {
  const { fc2AdultUrl } = config;

  return new Promise((resolve) => {
    crawler.queue({
      uri: `${fc2AdultUrl}${number}/`,
      jQuery: true,
      callback(error, res, done) {
        if (error) {
          console.log(error);
          resolve([]);
        } else {
          resolve(res.$('.items_article_SampleImagesArea a').map(function callback() {
            return res.$(this).attr('href');
          }).get() || []);
        }
        done();
      },
    });
  });
};

const getFc2Vendor = (number) => {
  const { fc2AdultUrl } = config;

  return new Promise((resolve) => {
    crawler.queue({
      uri: `${fc2AdultUrl}${number}/`,
      jQuery: true,
      callback(error, res, done) {
        if (error) {
          console.log(error);
          resolve([]);
        } else {
          resolve(res.$('.items_article_headerInfo li:last-child a').text() || '---');
        }
        done();
      },
    });
  });
};

const getMagnet = async (number) => {
  const { rssUrl } = config;
  return parser.parseURL(`${rssUrl}+${number}`).then((feed) => `magnet:?xt=urn:btih:${feed.items[0].hash}`).catch((e) => {
    console.log(e);
  });
};

export const fetchPosts = async () => {
  const { rssUrl, fc2FansUrl } = config;

  return parser.parseURL(rssUrl).then((feed) => Promise.all(
    feed.items.map(async (post) => {
      const { title, size, pubDate } = post;
      const number = title.match(/(\d{6,7})/)[0];
      const vendor = await getFc2Vendor(number);
      const images = await getFc2Img(number);
      return {
        title: `[${vendor}] ${title}`,
        size,
        pubDate,
        number,
        fc2fans: fc2FansUrl.replace('{number}', number),
        fc2Vendor: 'https://fc2club.com/index.php?info%5Bseller%5D={vendor}&c=search&a=init&catid=6&typeid=1&siteid=1&dosubmit=1'.replace('{vendor}', vendor),
        images,
      };
    }),
  )).catch((e) => {
    console.log(e);
  });
};

export const postDownload = async (number) => {
  const { nasUser, nasPassword } = config;
  const images = await getFc2Img(number);
  const vendor = await getFc2Vendor(number);
  const magnet = await getMagnet(number);
  const sid = await login(nasUser, nasPassword);

  if (!magnet) return ErrorCode[3];

  const folderName = `[${vendor}]${number}`;
  const urls = [magnet, ...images];

  const create = await createFolder(sid, folderName);
  const downloadR = await download(sid, folderName, urls);

  if (create) return ErrorCode[create];
  if (downloadR) return ErrorCode[downloadR];

  return true;
};
