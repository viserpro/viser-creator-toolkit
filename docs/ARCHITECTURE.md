# VISER Architecture

## Product direction
VISER is an autonomous, local-first AI video production platform. It is a standalone editor and production system, not a companion to CapCut. Windows and macOS are first-class desktop targets.

## Architecture layers
1. VISER Studio — React + TypeScript desktop UI, project workspace, media bin, preview, timeline, review and export.
2. VISER Intelligence — provider adapters, capability registry, AI gateway, workflow planner, agent orchestration and quality-control policies.
3. VISER Core Engine — versioned project model, editing command engine, media pipeline, preview pipeline, audio graph and render orchestration.
4. VISER Extensions — permissioned plugin SDK, MCP client/server adapters and custom tools.

## Technology direction
- Desktop shell: Tauri 2.
- UI: existing React + TypeScript + Vite application.
- Native services: Rust commands and background workers.
- Media: FFmpeg/FFprobe behind a platform-neutral media adapter.
- Preview: browser media pipeline/WebCodecs where supported, with native fallback strategy.
- Project persistence: SQLite with versioned migrations; portable project manifest and relative media references.
- AI gateway: provider-neutral TypeScript interfaces, structured outputs and capability discovery.
- Automation: durable workflow jobs, checkpoints, retries, cancellation and audit logs.

## Cross-platform contract
Windows and macOS must use the same project schema, editing command schema, AI provider contracts and user-facing workflow. Platform-specific code is isolated behind adapters.
- Windows: WebView2, Windows filesystem APIs, hardware decode/encode capability detection.
- macOS: WKWebView, sandbox/bookmark-aware file access where applicable, Apple Silicon and Intel capability detection.
- Build artifacts are produced on native CI runners for each OS. A Windows machine cannot certify a macOS build.
- Do not assume identical codecs, hardware encoders, GPU behavior or file permissions across operating systems. Probe capabilities at runtime.

## Core boundaries
- AI proposes plans; the deterministic editing engine validates and executes them.
- Providers never write project files directly. They return schema-validated actions.
- Source media is immutable by default. Generated media and caches live in managed project/output folders.
- Plugins receive only declared permissions and scoped capabilities.
- Network access is opt-in per provider/feature. Editing and rendering must remain usable offline.
- Every long-running workflow supports progress, cancellation, checkpoints and recovery.

## AI provider contract
Each provider adapter declares provider identity, connection method, supported modalities and context constraints, structured-output/tool-calling support, local/cloud classification, cost/rate-limit metadata where available, health checks and timeout behavior. The capability registry selects models by task requirements, user policy, availability and cost. It must not infer capabilities from a model name alone.

## Agent contract
Agents receive a typed task, scoped inputs and explicit tool permissions. They return typed outputs plus evidence/references to source assets. The orchestrator validates outputs before dispatching editing commands.
Initial roles: Director, Media Analyst, Scene Planner, Editor, Audio, Subtitle, Motion and Quality Control.

## Security and reliability
- Store API credentials in the OS credential store, never in project JSON or source control.
- Require user approval for destructive filesystem actions, external uploads, purchases or paid API operations.
- Enforce plugin permissions, process timeouts, resource limits and workspace boundaries.
- Keep an append-only task/event log with redacted secrets.
- Support safe retry and resume without duplicating destructive work.

## Licensing and distribution
Review every bundled codec, FFmpeg build configuration and third-party dependency before distribution. FFmpeg licensing changes when GPL or nonfree components are enabled. Maintain per-platform software bills of materials and notices. This is an engineering checklist, not legal advice.

## Current implementation status
VISER 0.3.0 is a React/Vite toolkit with media inventory and a basic timeline manifest. It is not yet a Tauri desktop application, full editor, AI gateway or renderer. The architecture above is the target, not a claim of completed functionality.
