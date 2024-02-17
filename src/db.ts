import pg from "pg";
import { Env } from "./constant";

export default async function loadIntoDB(ScrapedItem: ScrapedItem[], env: Env): Promise<boolean> {

  let client: pg.Client | null = null;

  try {
    client = new pg.Client({
      connectionString: env.PG_CONNECTION_STRING
    })
    await client.connect();

    // delete all data from db before inserting new one
    await client.query("DELETE FROM offers");
    for (let i = 0; i < ScrapedItem.length; i++) {
      let item = ScrapedItem[i];
      let query = 'INSERT INTO offers (product_title, buy_link, price, cut_price, img_alt, img_link) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id';
      let values = [item.title, item.link, item.price, item.cPrice, item.imgAlt, item.imgLink];
      await client.query(query, values)
    };
  } catch (e) {
    console.error(e);
    return false;
  }

  client.end();
  return true;

}