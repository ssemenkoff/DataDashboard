<script lang="ts" setup>
import { useConfigurationsStore, type ConfigurationDTO } from "@/plugins/data/ConfigurationPinia";
import { ref, getCurrentInstance } from "vue";
import { type VueVariableStorageProxy } from "@/plugins/variables/VueVariableStorageProxy";
import { RefreshType, SourceType, Types } from '@/types/enum';

const { configurations, updateConfigurations } = useConfigurationsStore();

const instance = getCurrentInstance();
const variablesStorage = instance?.appContext.config.globalProperties.$variableStorage as VueVariableStorageProxy;


const vars: ConfigurationDTO[] = [
  {
    name: "Test",
    config: {
      valueType: Types.Primitive,
      type: SourceType.AsyncParameters,
      refreshType: RefreshType.Trigger,
      request: 'https://glances.ssemenkoff.dev/api/4/cpu/total',
      description: 'test',
      refreshTrigger: 'test',
    }
  }
];

updateConfigurations(vars);
</script>

<template>
  <div class="configuration-editor-container">
    <h2>Test View</h2>
    <div class="variables-view">
      <div v-for="variable in configurations" :key="variable.name" class="variable-item">
        <div>Name: {{ variable.name }}</div>
        <div>Type: {{ variable.config.type }}</div>
        <div>Value: {{ variablesStorage.getVariable(variable.name).value }}</div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.configuration-editor-container {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  overflow: hidden;
  height: 100%;
  padding: 20px;
}

.configuration-editor-container h2 {
  margin: 0;
  padding: 16px;
  border-bottom: 1px dashed #e0e0e0;
}

.variables-view {
  border: 1px solid silver;
  padding: 16px;
}

.variable-item {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  padding-bottom: 10px;
  border-bottom: 1px solid #e0e0e0;
}
</style>