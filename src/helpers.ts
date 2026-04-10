import { BEE_PROTOCOL_VERSION_MANIFEST } from "@jobmatchme/bee-dance-schema";
import type { Envelope, Item, ProtocolCapabilities, ProtocolHelloPayload } from "./types.js";

export function nowIso(): string {
	return new Date().toISOString();
}

export function newMessageId(): string {
	return `msg_${crypto.randomUUID()}`;
}

export function newTurnId(): string {
	return `turn_${crypto.randomUUID()}`;
}

export function createTurnStart(
	input: Omit<
		Envelope<{ input: { kind: "text"; text: string }[]; hints?: Record<string, unknown> }>,
		"type" | "name" | "id" | "time"
	> &
		Partial<Pick<Envelope, "id" | "time">>,
): Envelope<{ input: { kind: "text"; text: string }[]; hints?: Record<string, unknown> }> {
	return {
		...input,
		id: input.id || newMessageId(),
		time: input.time || nowIso(),
		type: "command",
		name: "turn.start",
	};
}

export function createItemAppended(
	input: Omit<Envelope<{ item: Item }>, "type" | "name" | "id" | "time"> & Partial<Pick<Envelope, "id" | "time">>,
): Envelope<{ item: Item }> {
	return {
		...input,
		id: input.id || newMessageId(),
		time: input.time || nowIso(),
		type: "event",
		name: "item.appended",
	};
}

export function createApprovalRequested(
	input: Omit<
		Envelope<{ approvalId: string; scope: string; summary: string; details?: Record<string, unknown> }>,
		"type" | "name" | "id" | "time"
	> &
		Partial<Pick<Envelope, "id" | "time">>,
): Envelope<{ approvalId: string; scope: string; summary: string; details?: Record<string, unknown> }> {
	return {
		...input,
		id: input.id || newMessageId(),
		time: input.time || nowIso(),
		type: "event",
		name: "approval.requested",
	};
}

export function createProtocolHello(
	input: Omit<Envelope<ProtocolHelloPayload>, "type" | "name" | "id" | "time" | "payload"> &
		Partial<Pick<Envelope, "id" | "time">> & { capabilities: ProtocolCapabilities },
): Envelope<ProtocolHelloPayload> {
	const { capabilities, ...envelope } = input;
	return {
		...envelope,
		id: input.id || newMessageId(),
		time: input.time || nowIso(),
		type: "command",
		name: "protocol.hello",
		payload: {
			protocolVersion: BEE_PROTOCOL_VERSION_MANIFEST.protocolVersion,
			capabilities,
		},
	};
}
