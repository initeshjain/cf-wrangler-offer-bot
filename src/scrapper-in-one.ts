import cheerio from 'cheerio';
import pg from "pg";

export interface Env {
  PG_CONNECTION_STRING: string
}

type ScrapedItem = {
  title: string;
  price: string;
  cPrice: string;
  link: string;
  imgAlt: string;
  imgLink: string;
};

// URLs to scrape
const URLS: string[] = [
  "https://www.amazon.in/s?k=clearance+sale&rh=p_n_availability%3A-1&linkCode=osi&tag=technovani-21",
  "https://www.amazon.in/s?k=clearance+sale&rh=p_n_availability%3A-1&linkCode=osi&tag=technovani-21&ref=sr_pg_2"
];

const HEADERS: { [key: string]: string } = {
  "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36 Edg/114.0.1823.43",
  "Accept-Language": "en-US,en;q=0.5",
};

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const items = await scrapeItems(env);
    const jsonResponse = JSON.stringify(items);

    return new Response(jsonResponse, {
      headers: { 'Content-Type': 'application/json' },
    });
  },
};

async function scrapeItems(env: Env): Promise<boolean> {
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

  return dbRes;
}

// Add to DB

async function loadIntoDB(ScrapedItem: ScrapedItem[], env: Env): Promise<boolean> {
  let client: pg.Client | null = null;

  try {
    client = new pg.Client({
      connectionString: env.PG_CONNECTION_STRING
    })
    await client.connect();

    // delete all data from db before inserting new one
    const res = await client.query("DELETE FROM ");

    for (let i = 0; i < ScrapedItem.length; i++) {

      let item = ScrapedItem[i];

      let query = 'INSERT INTO offers (product_title, buy_link, price, cut_price, img_alt, img_link) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id';

      let values = [item.title, item.link, item.price, item.cPrice, item.imgAlt, item.imgLink];

      await client.query(query, values);

    };
  } catch (e) {
    console.error(e);
    return false;
  }

  await client.end();
  return true;

}
