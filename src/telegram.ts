/**
 * https://github.com/cvzi/telegram-bot-cloudflare
 */

import { Env } from "./constant";

/**
 * https://core.telegram.org/bots/api#sendmessage
 */
async function SendMessage(text: string, env: Env) {
  return (await fetch(apiUrl('sendMessage', {
    chat_id: env.CHATID,
    text,
    parse_mode: "HTML"
  }, env))).json()
}

/**
 * Return url to telegram api, optionally with parameters added
 */
function apiUrl(methodName: string, params: null | TGPayload = null, env: Env) {
  let query = ''
  if (params) {
    query = '?' + new URLSearchParams(params).toString()
  }
  return `https://api.telegram.org/bot${env.TOKEN}/${methodName}${query}`
}

// Start
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