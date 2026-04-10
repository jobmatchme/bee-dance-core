import type { ErrorObject } from "ajv";
import { generatedValidators } from "./generated-validators.js";
import type { Envelope } from "./types.js";

export function parseEnvelope(raw: string): Envelope {
	return JSON.parse(raw) as Envelope;
}

export function validateEnvelope(raw: unknown): raw is Envelope {
	return generatedValidators.envelope(raw);
}

export function assertValidEnvelope(raw: unknown): asserts raw is Envelope {
	if (!validateEnvelope(raw)) {
		const detail =
			generatedValidators.envelope.errors
				?.map((entry: ErrorObject) => `${entry.instancePath || "/"} ${entry.message}`)
				.join(", ") || "invalid envelope";
		throw new Error(detail);
	}
}

export function assertMessageName<T extends Envelope["name"]>(msg: Envelope, name: T): asserts msg is Envelope {
	if (msg.name !== name) {
		throw new Error(`Expected message ${name}, got ${msg.name}`);
	}
}
