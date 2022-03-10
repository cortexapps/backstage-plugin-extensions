import {CortexYaml, DeepPartial} from "./extensionApi";

describe('CortexYaml', () => {
  it('should allow extension properties', () => {
    const cortexYaml: DeepPartial<CortexYaml> = {
      'x-cortex-apm': {
        'datadog': {
          'my-new-property': 'foo',
          'serviceName': 'foo',
        }
      }
    }
  });
});