# VISER AI Platform Design

## Goal
Allow users to connect and combine different AI systems without coupling the editor to one vendor or model.

## Integration surfaces
1. Provider adapters: hosted APIs, local inference servers, OpenAI-compatible endpoints and custom REST services.
2. Model capability registry: records modalities, structured output, tool calling, context limits, latency/cost hints and health.
3. Agent runtime: executes role-based tasks with scoped tools.
4. MCP integration: connects external tools and agents through permissioned MCP clients/servers.
5. Plugin SDK: lets third parties contribute providers, agents, media tools and workflow steps.

## Provider adapter contract
Every adapter implements normalized operations for connection validation and health; model discovery where supported; structured text generation; image/audio/video input only when explicitly supported; tool calling only when explicitly supported; cancellation, timeout and normalized errors; and usage/cost metadata where available. A provider may implement only a subset. The UI must show unsupported capabilities rather than pretending every model can do everything.

## Capability-based routing
Routing considers required input/output modalities, structured-output reliability, tool-call requirements, user-selected provider/model preferences, local-only/privacy policy, estimated cost, latency, rate limits and provider availability. Users can pin a provider, choose automatic routing, or require local-only execution.

## Agent execution model
Task Request -> Plan -> Permission Check -> Agent Execution -> Schema Validation -> Editing Commands -> Result Verification.

Agent roles are replaceable. The stable contract is the task schema and editing command schema, not the underlying model.

## Initial agent roles
- Director: interprets the creative brief and establishes constraints.
- Media Analyst: catalogs footage and returns timestamped observations.
- Scene Planner: maps narrative beats to source ranges.
- Editor: proposes typed timeline operations.
- Audio: plans voice/music/SFX treatment.
- Subtitle: produces transcript and timed subtitle cues.
- Motion: proposes title, graphic and transition parameters.
- Quality Control: checks technical and editorial requirements.

## Safety model
- Agents cannot directly mutate source media or database files.
- Every edit is represented as a validated, reversible command.
- External uploads, paid calls and destructive operations require explicit policy/approval.
- Plugins receive least-privilege permissions and bounded resources.
- Secrets are stored in OS credential storage and redacted from logs.
- Workflows have checkpoints, cancellation, retry limits and recovery.

## Offline behavior
The editor, project system, media analysis based on local tools and rendering must work without internet. Cloud AI is an optional capability. Local AI requires a compatible local runtime and sufficient hardware; it is not guaranteed on every machine.
