module.exports = {
  root: true,
  extends: ['eslint-config-digitalbazaar'],
  env: {
    node: true
  },
  globals: {
    Uint8Array: true
  },
  ignorePatterns: ['dist/']
}
