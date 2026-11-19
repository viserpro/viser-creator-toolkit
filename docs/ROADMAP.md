# VISER Roadmap

Product target: VISER Autonomous Studio, a standalone Windows and macOS desktop application that turns raw media and user instructions into finished videos. CapCut is not a target dependency or export destination.

## 0.3.0 - Media Intelligence foundation (complete)
- FFprobe-backed media inventory.
- Typed multi-track timeline manifest and basic operations.
- React/Vite creator workspace.

## 0.4.0 - Cross-platform desktop and editing foundation
- Tauri 2 desktop shell for Windows and macOS.
- Native file/folder import through scoped commands.
- Media library, thumbnail extraction and metadata.
- Real source-footage playback and seek/scrub.
- Interactive multi-track timeline with drag/drop, snapping and zoom.
- Editing command history, undo/redo and project save/reopen.
- Project schema and SQLite persistence with migrations.
- Native CI build checks for Windows and macOS.

## 0.5.0 - VISER Core Editing and Render Engine
- Deterministic editing command engine.
- Video/audio/image/text/overlay tracks.
- Trim, split, ripple, crop, transform, speed and keyframes.
- Audio mixing, transitions and effects graph.
- FFmpeg-based render pipeline, progress, cancellation and resume.
- Render validation and export presets.
- Hardware acceleration capability detection and proxy workflow.

## 0.6.0 - AI Gateway and Capability Registry
- Provider-neutral adapter contract.
- Cloud, local, OpenAI-compatible and custom endpoint support.
- Model capability discovery and health checks.
- Credential storage via OS keychain/credential vault.
- Task routing by modality, quality, latency, cost and user policy.
- Offline editing remains available without any AI provider.

## 0.7.0 - Agent Orchestration
- Workflow planner, durable task queue and checkpoints.
- Director, Media Analyst, Scene Planner, Editor, Audio, Subtitle, Motion and QC agents.
- Typed action schema and validation before execution.
- Retry, cancellation, audit logs and human approval gates.

## 0.8.0 - Autonomous Production
- Raw footage + instructions to complete production plan.
- Scene selection, edit assembly, subtitles, audio and motion graphics.
- Automatic quality checks and bounded self-repair.
- User review and revision instructions.
- Reproducible final rendering.

## 0.9.0 - Open Extension Ecosystem
- Documented plugin SDK and manifest format.
- Permissioned tools and MCP integration.
- Custom agents, provider adapters and workflow templates.
- Compatibility checks, signing/trust policy and plugin isolation.

## 0.9.5 - Reliability and performance
- Proxy and cache management.
- Memory/VRAM budgets and background scheduling.
- Crash recovery, diagnostics and performance benchmarks.
- Cross-platform codec and hardware test matrix.

## 1.0.0 - Public release
- Signed Windows and macOS installers.
- Upgrade/uninstall flow and recovery documentation.
- Accessibility, localization, onboarding and telemetry controls.
- Security, licensing and distribution audit.
- End-to-end production acceptance suite.

## Release gates
A milestone is complete only when its acceptance tests pass on both Windows and macOS where applicable. macOS release readiness requires native macOS CI and testing; Windows-only builds do not establish macOS compatibility. Dates are not promised until technical spikes and hardware benchmarks establish realistic estimates.
