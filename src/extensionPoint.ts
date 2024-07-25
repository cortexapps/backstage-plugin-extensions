import { createExtensionPoint } from '@backstage/backend-plugin-api';
import { ExtensionApi } from './extensionApi';

export interface CortexExtensionApiExtensionPoint {
  setExtensionApi(extensionApi: ExtensionApi): void;
}

export const cortexExtensionApiExtensionPoint =
  createExtensionPoint<CortexExtensionApiExtensionPoint>({
    id: 'cortex.extension-api',
  });
