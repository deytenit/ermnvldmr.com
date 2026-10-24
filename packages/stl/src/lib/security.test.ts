import { createHash } from 'node:crypto';
import vm from 'node:vm';

import { describe, expect, it } from 'vitest';

import {
  THEME_INIT_SCRIPT_HASH,
  TRUSTED_TYPES_INIT_SCRIPT,
  TRUSTED_TYPES_INIT_SCRIPT_HASH,
} from './security';

interface MockPolicyOptions {
  createHTML?: (s: string) => string;
  createScript?: (s: string) => string;
  createScriptURL?: (u: string) => string;
}

interface MockTrustedTypes {
  createPolicy: (name: string, options: MockPolicyOptions) => unknown;
}

interface PolicyRecorder {
  name: string;
  options: MockPolicyOptions;
}

describe('Security policy script hashes and execution', () => {
  it('computes exact SHA-256 base64 hash for TRUSTED_TYPES_INIT_SCRIPT', () => {
    const computedHash = `sha256-${createHash('sha256').update(TRUSTED_TYPES_INIT_SCRIPT).digest('base64')}`;
    expect(computedHash).toBe(TRUSTED_TYPES_INIT_SCRIPT_HASH);
  });

  it('computes exact SHA-256 base64 hash for THEME_INIT_SCRIPT constant', () => {
    // Theme initializer literal from packages/ui
    const themeScript =
      '(function(){try{var k=\'ermnvldmr/ui/lib/theme\';var p=JSON.parse(localStorage.getItem(k)||\'"system"\');var d=p===\'dark\'||(p===\'system\'&&window.matchMedia(\'(prefers-color-scheme:dark)\').matches);document.documentElement.classList.toggle(\'dark\',d)}catch(e){}})();';
    const computedHash = `sha256-${createHash('sha256').update(themeScript).digest('base64')}`;
    expect(computedHash).toBe(THEME_INIT_SCRIPT_HASH);
  });

  it('executes TRUSTED_TYPES_INIT_SCRIPT without errors when window.trustedTypes is absent', () => {
    const sandbox = {
      window: {},
    };
    vm.createContext(sandbox);

    expect(() => {
      vm.runInContext(TRUSTED_TYPES_INIT_SCRIPT, sandbox);
    }).not.toThrow();
  });

  it('evaluates TRUSTED_TYPES_INIT_SCRIPT and registers default policy when window.trustedTypes is present', () => {
    const recorder: PolicyRecorder = {
      name: '',
      options: {},
    };

    const mockTrustedTypes: MockTrustedTypes = {
      createPolicy: (name: string, options: MockPolicyOptions) => {
        recorder.name = name;
        recorder.options = options;
        return { name };
      },
    };

    const sandbox = {
      window: {
        trustedTypes: mockTrustedTypes,
      },
    };
    vm.createContext(sandbox);

    expect(() => {
      vm.runInContext(TRUSTED_TYPES_INIT_SCRIPT, sandbox);
    }).not.toThrow();

    expect(recorder.name).toBe('default');
    expect(recorder.options.createHTML?.('<p>safe</p>')).toBe('<p>safe</p>');
    expect(recorder.options.createScript?.('console.log(1)')).toBe('console.log(1)');
    expect(recorder.options.createScriptURL?.('https://example.com/lib.js')).toBe(
      'https://example.com/lib.js'
    );
  });
});
