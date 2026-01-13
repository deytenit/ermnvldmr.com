export default {
  branches: [
    { name: 'next', prerelease: true },
    { name: 'release/*', channel: false },
  ],
  plugins: [
    '@semantic-release/commit-analyzer',
    '@semantic-release/release-notes-generator',
    '@semantic-release/github',
    'semantic-release-export-data',
  ],
};
