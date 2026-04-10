import { BEE_PROTOCOL_SCHEMAS } from "@jobmatchme/bee-dance-schema";
import { createProtocolAjv } from "./ajv.js";
import type { Envelope, Item, ProtocolCapabilities, ProtocolHelloPayload, ProtocolWelcomePayload } from "./types.js";

const ajv = createProtocolAjv();

const validateEnvelopeSchema = ajv.compile<Envelope>(BEE_PROTOCOL_SCHEMAS.envelope);
const validateCapabilitiesSchema = ajv.compile<ProtocolCapabilities>(BEE_PROTOCOL_SCHEMAS.capabilities);
const validateProtocolHelloSchema = ajv.compile<ProtocolHelloPayload>(BEE_PROTOCOL_SCHEMAS.protocolHello);
const validateProtocolWelcomeSchema = ajv.compile<ProtocolWelcomePayload>(BEE_PROTOCOL_SCHEMAS.protocolWelcome);
const validateItemSchema = ajv.compile<Item>(BEE_PROTOCOL_SCHEMAS.item);
const validateTurnStartSchema = ajv.compile(BEE_PROTOCOL_SCHEMAS.turnStart);
const validateTurnCancelSchema = ajv.compile(BEE_PROTOCOL_SCHEMAS.turnCancel);
const validateActionResolvedSchema = ajv.compile(BEE_PROTOCOL_SCHEMAS.actionResolved);
const validateApprovalResolvedSchema = ajv.compile(BEE_PROTOCOL_SCHEMAS.approvalResolved);
const validateEventRunSchema = ajv.compile(BEE_PROTOCOL_SCHEMAS.eventRun);
const validateEventItemSchema = ajv.compile(BEE_PROTOCOL_SCHEMAS.eventItem);
const validateEventActionSchema = ajv.compile(BEE_PROTOCOL_SCHEMAS.eventAction);
const validateEventApprovalSchema = ajv.compile(BEE_PROTOCOL_SCHEMAS.eventApproval);

export const generatedValidators = {
	envelope: validateEnvelopeSchema,
	capabilities: validateCapabilitiesSchema,
	protocolHello: validateProtocolHelloSchema,
	protocolWelcome: validateProtocolWelcomeSchema,
	item: validateItemSchema,
	turnStart: validateTurnStartSchema,
	turnCancel: validateTurnCancelSchema,
	actionResolved: validateActionResolvedSchema,
	approvalResolved: validateApprovalResolvedSchema,
	eventRun: validateEventRunSchema,
	eventItem: validateEventItemSchema,
	eventAction: validateEventActionSchema,
	eventApproval: validateEventApprovalSchema,
} as const;
