import cheerio from 'cheerio';
import { Env, URLS, HEADERS } from "./constant";
import loadIntoDB from './db';
import sendToTG from './telegram';

export default async function scrapeItems(env: Env): Promise<boolean> {
  const items: ScrapedItem[] = [];

  for (const url of URLS) {
    const response = await fetch(url, { headers: HEADERS });
    const text = await response.text();
    const $ = cheerio.load(text);

    $('div.a-section.a-spacing-base').each((index, element) => {
      const title = $(element).find('span.a-size-base-plus.a-color-base.a-text-normal').text().trim();
      const price = 'Rs. ' + $(element).find('span.a-price-whole').text().trim();
      const cPriceElement = $(element).find('span.a-price.a-text-price span.a-offscreen');
      const cPrice = cPriceElement.length ? cPriceElement.text().trim() : '';
      const link = 'https://www.amazon.in' + $(element).find('a.a-link-normal.s-underline-text.s-underline-link-text.s-link-style.a-text-normal').attr('href') + '&tag=technovani-21';
      const imgAlt = $(element).find('img.s-image').attr('alt') || '';
      const imgLink = $(element).find('img.s-image').attr('src') || '';

      items.push({ title, price, cPrice, link, imgAlt, imgLink });
    });
  }

  let dbRes = await loadIntoDB(items, env);
  // const dbRes = true;

  if (dbRes) {
    await sendToTG(items, env);
  }

  return dbRes;
}
