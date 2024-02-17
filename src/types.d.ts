type ScrapedItem = {
  title: string;
  price: string;
  cPrice: string;
  link: string;
  imgAlt: string;
  imgLink: string;
};

type TGPayload = {
  chat_id: string;
  text: string;
  parse_mode: string;
}