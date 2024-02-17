// URLs to scrape
export const URLS: string[] = [
  "https://www.amazon.in/s?k=clearance+sale&rh=p_n_availability%3A-1&linkCode=osi&tag=technovani-21",
  "https://www.amazon.in/s?k=clearance+sale&rh=p_n_availability%3A-1&linkCode=osi&tag=technovani-21&ref=sr_pg_2"
];

export const HEADERS: { [key: string]: string } = {
  "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36 Edg/114.0.1823.43",
  "Accept-Language": "en-US,en;q=0.5",
};

export interface Env {
  PG_CONNECTION_STRING: string,
  TOKEN: string,
  CHATID: string
}