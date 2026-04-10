import type { Envelope, HandlerMap } from "./types.js";

export async function dispatchMessage<Ctx>(msg: Envelope, handlers: HandlerMap<Ctx>, ctx: Ctx): Promise<void> {
	const handler = handlers[msg.name];
	if (!handler) {
		return;
	}
	await handler(msg, ctx);
}
