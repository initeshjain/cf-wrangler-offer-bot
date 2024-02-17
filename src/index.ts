import scrapeItems from "./scrapper";
import { Env } from "./constant";

export default {
	async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
		const res = await scrapeItems(env);
		const jsonResponse = JSON.stringify({ ok: res });
		return new Response(jsonResponse, {
			headers: { 'Content-Type': 'application/json' },
		});
	},
};
