# Architecture

## Current starter

- `src/Root.tsx`: registers the Remotion composition and its default props.
- `src/components/OverlayDemo.tsx`: reusable transparent overlay component.
- `remotion.config.ts`: local Remotion render configuration.
- `out/`: generated renders; ignored by Git.

## Design boundaries

The public repository contains generic reusable code and synthetic examples only. Creator-owned media, transcripts, project files, account data, machine paths, API keys, and private automation instructions remain outside the repository.

## Planned modules

1. Script schema and validation.
2. Asset manifest and media preflight.
3. Scene sequencing and reusable motion presets.
4. Render adapters and output verification.
5. Optional integrations, isolated behind documented adapters.

Modules are added only when there is a reproducible use case, tests, and documentation.
