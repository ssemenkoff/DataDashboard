import type { ConfigurationDTO } from "@/plugins/data/ConfigurationPinia";
import { ref, watch, type Ref } from "vue";
import type { VueVariableStorageProxy } from "../VueVariableStorageProxy";

export function useVariableManager(
  config: Ref<ConfigurationDTO>,
  variableStorageProxy: VueVariableStorageProxy
) {
  const variable = ref<{ name: string; config: INewVariableConfig; value: any } | null>(null);;
  
  const createVariable = () => {
    removeVariable();
    variable.value = variableStorageProxy.createVariable(config.value.name, config.value.config as any);
  };

  const removeVariable = () => {
    if (variable.value) {
      variableStorageProxy.removeVariable(variable.value.name);
      variable.value = null;
    }
  };

  watch(() => config, createVariable, { deep: true });

  return {
    variable,
    createVariable,
    removeVariable
  };
}