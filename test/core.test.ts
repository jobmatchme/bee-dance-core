import { describe, expect, it } from "vitest";
import {
	assertMessageName,
	assertValidEnvelope,
	createApprovalRequested,
	createItemAppended,
	createProtocolHello,
	createTurnStart,
	dispatchMessage,
	type Envelope,
	negotiateCapabilities,
	parseEnvelope,
	supportsPartKind,
	supportsProfile,
} from "../src/index.js";

describe("bee-dance-core", () => {
	it("creates and validates core messages", () => {
		const turn = createTurnStart({
			sessionId: "sess_1",
			turnId: "turn_1",
			from: { kind: "human", id: "slack:user:U1" },
			to: { kind: "agent", id: "agent:main" },
			replyTo: null,
			payload: {
				input: [{ kind: "text", text: "Bitte analysiere das Repo." }],
			},
		});

		assertValidEnvelope(turn);
		assertMessageName(turn, "turn.start");
		expect(turn.type).toBe("command");
	});

	it("parses and dispatches a message", async () => {
		const item = createItemAppended({
			sessionId: "sess_1",
			turnId: "turn_1",
			from: { kind: "agent", id: "agent:main" },
			to: { kind: "human", id: "slack:user:U1" },
			replyTo: null,
			payload: {
				item: {
					id: "item_1",
					kind: "message",
					role: "assistant",
					parts: [{ kind: "text", text: "Ich prüfe jetzt die Projektstruktur." }],
				},
			},
		});

		const seen: string[] = [];
		const raw = JSON.stringify(item);
		const parsed = parseEnvelope(raw);

		await dispatchMessage(
			parsed,
			{
				"item.appended": async (msg: Envelope) => {
					seen.push(msg.name);
				},
			},
			{},
		);

		expect(seen).toEqual(["item.appended"]);
	});

	it("supports capability negotiation and protocol hello", () => {
		const hello = createProtocolHello({
			sessionId: "sess_1",
			from: { kind: "human", id: "gateway:slack" },
			to: { kind: "agent", id: "agent:main" },
			replyTo: null,
			capabilities: {
				coreVersions: ["2026-04-02", "2026-03-31"],
				interactionProfiles: ["profile.chat.slack", "profile.chat.web"],
				inputParts: ["text", "json"],
				outputParts: ["text", "status", "approval"],
				events: ["item.appended", "item.updated"],
				actions: ["tool_call"],
				extensions: {
					"ext.memory.query": "1",
				},
				streaming: true,
			},
		});

		expect(hello.name).toBe("protocol.hello");
		assertValidEnvelope(hello);

		const negotiated = negotiateCapabilities(hello.payload.capabilities, {
			coreVersions: ["2026-04-02"],
			interactionProfiles: ["profile.chat.slack"],
			inputParts: ["text"],
			outputParts: ["text", "approval"],
			events: ["item.appended"],
			actions: [],
			extensions: {},
			streaming: false,
		});

		expect(negotiated.coreVersions).toEqual(["2026-04-02"]);
		expect(supportsProfile(hello.payload.capabilities, "profile.chat.slack")).toBe(true);
		expect(supportsPartKind(hello.payload.capabilities, "text")).toBe(true);
	});

	it("creates approval requests", () => {
		const approval = createApprovalRequested({
			sessionId: "sess_2",
			turnId: "turn_2",
			from: { kind: "agent", id: "agent:main" },
			to: { kind: "human", id: "slack:user:U1" },
			replyTo: null,
			payload: {
				approvalId: "apr_1",
				scope: "run_command",
				summary: "Soll git status ausgeführt werden?",
				details: { command: "git status" },
			},
		});

		expect(approval.name).toBe("approval.requested");
		expect(approval.type).toBe("event");
	});
});
