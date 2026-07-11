#!/usr/bin/env node

import { runCli } from './lib/runner.js';

runCli().catch((err) => {
  console.error('An unexpected error occurred:', err);
  process.exit(1);
});
