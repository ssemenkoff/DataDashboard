import { type App } from 'vue';
import { VariableStorage } from './plugins/variables/VariableStorage';
import { VueVariableStorageProxy } from './plugins/variables/VueVariableStorageProxy';

export function initVariables(app: App) {
  const variableStorage = new VariableStorage();
  const variableStorageProxy = new VueVariableStorageProxy(variableStorage);

  app.config.globalProperties.$variableStorage = variableStorageProxy;
}