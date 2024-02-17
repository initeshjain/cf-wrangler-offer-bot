import scrapeItems from "./scrapper";
import { Env } from "./constant";

export default {
	async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
		console.log("Start...");
		const res = await scrapeItems(env);
		console.log("res", res);
		const jsonResponse = JSON.stringify({ ok: res });
		console.log("jsonResponse", jsonResponse);
		return new Response(jsonResponse, {
			headers: { 'Content-Type': 'application/json' },
		});
	},
};
