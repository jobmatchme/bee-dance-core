import { BEE_PROTOCOL_SCHEMAS } from "@jobmatchme/bee-dance-schema";
import { Ajv2020 } from "ajv/dist/2020.js";

export function createProtocolAjv() {
	const ajv = new Ajv2020({
		allErrors: true,
		strict: false,
		schemas: Object.values(BEE_PROTOCOL_SCHEMAS),
	});
	return ajv;
}
