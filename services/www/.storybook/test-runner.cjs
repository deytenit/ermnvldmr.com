/** @type {import('@storybook/test-runner').TestRunnerConfig} */
module.exports = {
  async postVisit(page, context) {
    // Dynamically import ESM module
    const { getStoryContext } = await import('@storybook/test-runner');
    
    // Get story context for debugging
    await getStoryContext(page, context);
    
    // Basic smoke test - story rendered without errors
    const element = page.locator('#storybook-root');
    await element.waitFor();
  },
};
