export type EnvelopeType = "command" | "event" | "response";
export type ActorKind = "human" | "agent" | "system";
export type Audience = "direct" | "channel" | "broadcast";
export type Visibility = "private" | "shared" | "public";
export type ItemKind = "message" | "thinking" | "artifact" | "status" | "question" | "action";
export type ItemRole = "user" | "assistant" | "system";

export interface ActorRef {
	kind: ActorKind;
	id: string;
}

export interface ProtocolCapabilities {
	coreVersions: string[];
	interactionProfiles?: string[];
	inputParts?: string[];
	outputParts?: string[];
	events?: string[];
	actions?: string[];
	extensions?: Record<string, string>;
	streaming?: boolean;
}

export interface ProtocolHelloPayload {
	protocolVersion: string;
	capabilities: ProtocolCapabilities;
}

export interface ProtocolWelcomePayload {
	protocolVersion: string;
	selectedCoreVersion: string;
	capabilities: ProtocolCapabilities;
}

export type ItemPart =
	| { kind: "text"; text: string }
	| { kind: "status"; status: string; level?: "info" | "warning" | "error" }
	| {
			kind: "approval";
			approvalId: string;
			title: string;
			summary?: string;
			details?: unknown;
			options?: { id: string; label: string }[];
	  }
	| {
			kind: "artifactRef";
			artifactId: string;
			name?: string;
			title?: string;
			mimeType?: string;
			uri?: string;
			sizeBytes?: number;
	  }
	| { kind: "patch"; files: { path: string; diff: string }[] }
	| { kind: "json"; value: unknown }
	| {
			kind: "choice";
			choiceId: string;
			title: string;
			summary?: string;
			options: { id: string; label: string; description?: string }[];
	  }
	| {
			kind: "form";
			formId: string;
			title: string;
			fields: {
				name: string;
				label: string;
				type: "text" | "textarea" | "number" | "boolean" | "select";
				required?: boolean;
				options?: { id: string; label: string }[];
			}[];
	  }
	| { kind: "log"; text: string; stream?: "stdout" | "stderr" | "combined" }
	| { kind: "diff"; files: { path: string; diff: string }[] };

export interface Item {
	id: string;
	kind: ItemKind;
	role: ItemRole | "tool";
	parts: ItemPart[];
	references?: string[];
	tags?: string[];
	visibility?: Visibility;
}

export interface Envelope<Payload = unknown> {
	id: string;
	type: EnvelopeType;
	name: string;
	time: string;
	sessionId: string;
	threadId?: string;
	turnId?: string;
	from: ActorRef;
	to?: ActorRef;
	replyTo?: string | null;
	audience?: Audience;
	visibility?: Visibility;
	tags?: string[];
	references?: string[];
	payload: Payload;
}

export type HandlerMap<Ctx = unknown> = Record<string, (msg: Envelope, ctx: Ctx) => Promise<void> | void>;
