# Platform Support Policy

## First-class desktop platforms
- Windows 10/11 x64 initially; ARM64 is a later validation target.
- macOS 13+ as the initial supported baseline, with Apple Silicon prioritized and Intel compatibility evaluated during CI.
- Tauri 2 is the desktop shell candidate because it supports Windows and macOS from a shared frontend. Final minimum OS versions are a product decision and must be verified against dependencies before release.

## Shared behavior
The following must be platform-neutral: project file format and schema migrations; timeline/edit command model; AI provider and agent contracts; workflow definitions and task logs; render job specifications and output validation.

## Platform adapters
Isolate native differences behind interfaces for file dialogs, file access and permissions; credential storage; hardware capability detection; media decoding/encoding; background process lifecycle; app updates, signing and packaging.

## CI and release
- Windows runner builds and tests Windows artifacts.
- macOS runner builds and tests macOS artifacts.
- Run shared unit tests on both platforms.
- Run media integration tests with a small redistributable fixture set.
- Sign and notarize macOS distribution artifacts before public release.
- Sign Windows installers and publish checksums.
- Keep third-party notices and FFmpeg build/license metadata with each release.

## Media compatibility
Never assume the same codec support or hardware acceleration across Windows and macOS. Detect actual runtime capabilities and provide clear fallback paths. Test H.264, HEVC, ProRes, VP9 and AV1 decode/encode paths independently where supported.

## Developer prerequisites
Tauri development requires platform-specific toolchains. Windows development needs Microsoft C++ Build Tools and WebView2; macOS development needs Xcode or Command Line Tools. Build and signing must run on native OS environments.
