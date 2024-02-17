import { Env } from "./constant";

async function SendMessage(text: string, env: Env) {
  return (await fetch(apiUrl('sendMessage', {
    chat_id: env.CHATID,
    text,
    parse_mode: "HTML"
  }, env))).json()
}

function apiUrl(methodName: string, params: null | TGPayload = null, env: Env) {
  let query = ''
  if (params) {
    query = '?' + new URLSearchParams(params).toString()
  }
  return `https://api.telegram.org/bot${env.TOKEN}/${methodName}${query}`
}

export default async function sendToTG(rows: ScrapedItem[], env: Env) {

  for (let i = 0; i < rows.length; i++) {
    let msg = "🔥 SALE SALE SALE 🚀 \n\n";

    msg += rows[i].title;
    msg += "\n\n";

    msg += "<s>" + rows[i].cPrice + "</s> " + rows[i].price + "\n\n";

    msg +=
      "<a target='_blank' href='" + rows[i].link + "'>Grab Now 🤑" + "</a>";

    await SendMessage(msg, env);
    await new Promise<void>((resolve, reject) => {
      setTimeout(() => resolve(), 3000)
    })
  }
}