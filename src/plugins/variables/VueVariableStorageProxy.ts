import { reactive } from "vue";
import type { VariableStorage } from "./VariableStorage";

export class VueVariableStorageProxy {
  private storage: VariableStorage;

  constructor(storage: VariableStorage) {
    this.storage = storage;
  }

  createVariable(type: string, name: string, config: INewVariableConfig) {
    const variable = this.storage.createVariable(type, name, config);
    const reactiveVariable = reactive(variable);

    const updateFn = () => {
      reactiveVariable.updateTimestamp = Date.now();
    };

    variable.subscribe(updateFn);
    
    return reactiveVariable;
  }

  removeVariable(name: string) {
    this.storage.removeVariable(name);
  }

  getVariable(name: string) {
    return reactive(this.storage.getVariable(name));
  }
}