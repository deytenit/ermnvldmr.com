import { getStoryContext } from '@storybook/test-runner';

import type { TestRunnerConfig } from '@storybook/test-runner';

const config: TestRunnerConfig = {
  async postVisit(page, context) {
    // Get story context for debugging
    await getStoryContext(page, context);
    
    // Basic smoke test - story rendered without errors
    const element = page.locator('#storybook-root');
    await element.waitFor();
  },
};

export default config;
