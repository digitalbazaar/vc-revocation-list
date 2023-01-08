# @digitalbazaar/vc-revocation-list ChangeLog

## 6.0.0 - 2023-01-dd

### Changed
- **BREAKING**: Use little-endian bit order in bitstrings. Previous versions
  used little-endian order internally for the bytes used to represent the
  bitstring, but big-endian order for the bits. This makes the endianness
  consistently little endian. Any legacy status lists that depended on the old
  order will be incompatible with this version.

## 5.0.1 - 2023-01-04

### Fixed
- Fix import example in readme to be namespaced.

## 5.0.0 - 2022-10-25

### Changed
- **BREAKING**: Use `@digitalbazaar/vc@5` to get better safe mode
  protections.

## 4.0.0 - 2022-06-16

### Changed
- **BREAKING**: Rename package to `@digitalbazaar/vc-revocation-list`.
- **BREAKING**: Convert to module (ESM).
- **BREAKING**: Require Node.js >=14.
- Update dependencies.
- Lint module.

## 3.0.0 - 2021-05-24

### Changed
- **BREAKING**: Revocation list credentials must have the same `issuer` value
  as the credential to be revoked.
  - This requirement can be removed by setting the new `verifyMatchingIssuers`
    parameter to the `checkStatus` API to `false`.
- Clean-up and update test and regular dependencies.

## 2.0.0 - 2020-07-17

### Changed
- **BREAKING**: Remove `Bitstring` export. `Bitstring` is now available via
  the npm package `@digitalbazaar/bitstring`.

## 1.1.1 - 2020-07-17

### Fixed
- Replace the `Bitstring` export that was accidentally removed in v1.1.0.

## 1.1.0 - 2020-07-14

### Changed
- Replace internal bitstring implementation with @digitalbazaar/bitstring.

## 1.0.0 - 2020-04-29

### Added
- Add core files.

- See git history for changes previous to this release.
