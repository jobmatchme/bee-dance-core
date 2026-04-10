import type { ProtocolCapabilities } from "./types.js";

export interface NegotiatedCapabilities {
	coreVersions: string[];
	interactionProfiles: string[];
	inputParts: string[];
	outputParts: string[];
	events: string[];
	actions: string[];
	extensions: Record<string, string>;
	streaming: boolean;
}

export function negotiateCapabilities(
	clientCaps: ProtocolCapabilities,
	serverCaps: ProtocolCapabilities,
): NegotiatedCapabilities {
	return {
		coreVersions: intersect(clientCaps.coreVersions, serverCaps.coreVersions),
		interactionProfiles: intersect(clientCaps.interactionProfiles || [], serverCaps.interactionProfiles || []),
		inputParts: intersect(clientCaps.inputParts || [], serverCaps.inputParts || []),
		outputParts: intersect(clientCaps.outputParts || [], serverCaps.outputParts || []),
		events: intersect(clientCaps.events || [], serverCaps.events || []),
		actions: intersect(clientCaps.actions || [], serverCaps.actions || []),
		extensions: intersectMaps(clientCaps.extensions || {}, serverCaps.extensions || {}),
		streaming: Boolean(clientCaps.streaming && serverCaps.streaming),
	};
}

export function isCoreCompatible(clientCaps: ProtocolCapabilities, serverCaps: ProtocolCapabilities): boolean {
	return negotiateCapabilities(clientCaps, serverCaps).coreVersions.length > 0;
}

export function supportsProfile(capabilities: ProtocolCapabilities, profile: string): boolean {
	return (capabilities.interactionProfiles || []).includes(profile);
}

export function supportsPartKind(capabilities: ProtocolCapabilities, partKind: string): boolean {
	return (capabilities.inputParts || []).includes(partKind) || (capabilities.outputParts || []).includes(partKind);
}

function intersect(left: string[], right: string[]): string[] {
	const rightSet = new Set(right);
	return left.filter((value) => rightSet.has(value));
}

function intersectMaps(left: Record<string, string>, right: Record<string, string>): Record<string, string> {
	const next: Record<string, string> = {};
	for (const [key, value] of Object.entries(left)) {
		if (right[key] === value) {
			next[key] = value;
		}
	}
	return next;
}
