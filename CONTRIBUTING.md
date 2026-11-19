# Contributing

Thanks for helping improve VISER.

## Before opening a pull request

1. Search existing issues and pull requests.
2. Keep changes small and focused.
3. Explain the creator problem being solved.
4. Include reproduction steps or a sample using synthetic media.
5. Update documentation when behavior changes.
6. Never include private media, credentials, account data, or machine-specific paths.

## Local checks

```powershell
npm install
npm run typecheck
```

For composition changes, open Remotion Studio and verify the visual result. If you change rendering, document the FFmpeg version and relevant codec/pixel format.

## Pull request checklist

- [ ] The change solves a clear user problem.
- [ ] No private or copyrighted media is included without redistribution rights.
- [ ] No secrets or local absolute paths are included.
- [ ] Documentation is updated.
- [ ] Typecheck passes.
- [ ] Preview or render has been manually checked when relevant.

By submitting a contribution, you agree that your contribution is provided under the repository's MIT license.
