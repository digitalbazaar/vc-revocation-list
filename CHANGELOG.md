# vc-revocation-list-2020 ChangeLog

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
