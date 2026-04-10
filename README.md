# `@jobmatchme/bee-dance-core`

`bee-dance-core` is the small runtime layer that sits on top of
`@jobmatchme/bee-dance-schema`.

Where the schema package only defines the message contract, this package adds
the practical pieces needed by applications that want to speak the Bee Dance
protocol in real systems: schema loading, validation, helper builders, parsing,
dispatching, and capability negotiation.

## What this package is for

Agent systems usually need two things at the same time:

- a protocol that stays explicit and reviewable at the schema level
- a small implementation layer that makes the protocol easy to use in code

`bee-dance-core` covers the second part. It is intentionally narrow in scope so
that transport adapters, gateways, sidecars, and agent runtimes can all reuse
the same protocol mechanics without inheriting each other's infrastructure
choices.

## What this package contains

- AJV setup for the Bee Dance schemas
- compiled validators for envelopes and payload types
- TypeScript types for envelopes, actors, items, and capabilities
- helper functions for constructing common protocol messages
- parsing and assertion helpers
- a tiny dispatcher for routing messages by name
- capability negotiation helpers

## What this package does not contain

- transport code such as NATS, HTTP, WebSockets, or Slack bindings
- queueing or orchestration logic
- agent execution logic
- persistence or session storage

Those concerns belong in higher-level packages.

## Design intent

The goal is to keep the protocol runtime small, predictable, and portable. A
gateway should be able to use it to validate and emit messages. A sidecar
should be able to use it to adapt between systems. An agent runtime should be
able to use it without importing UI or transport concerns.

That separation makes protocol evolution easier. The schema package can change
deliberately, and this runtime can follow with focused updates, while
application packages remain thinner and more replaceable.

## Typical usage

Applications normally use this package together with the schema package to:

- validate inbound envelopes before acting on them
- build outbound envelopes with helper functions
- negotiate supported protocol features between peers
- dispatch messages to handlers based on message names

## Publishing

The package is intended for public npm publication from GitHub Actions. A tag
such as `v0.1.3` is expected to match the `package.json` version. The GitHub
workflow then installs dependencies with `npm ci`, builds the package, and
publishes it to npm using an `NPM_TOKEN` repository secret.

## License

MIT
