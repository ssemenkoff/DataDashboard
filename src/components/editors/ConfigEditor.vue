<script lang="ts" setup>
import { useConfigurationsStore, type ConfigurationDTO } from '@/plugins/data/ConfigurationPinia';
import { Types, RefreshType, SourceType } from '@/types/enum';
import { computed, watch, ref } from 'vue';
import { VariableStorage } from '@/plugins/variables/VariableStorage';
import { VueVariableStorageProxy } from '@/plugins/variables/VueVariableStorageProxy';

import ComputedVariable from '@/components/variables/ComputedVariable.vue';
import ConstantVariable from '@/components/variables/ConstantVariable.vue';
import QueryVariable from '@/components/variables/QueryVariable.vue';
import TimeVariable from '@/components/variables/TimeVariable.vue';
import RequestVariable from '@/components/variables/RequestVariable.vue';
import BrowserPropertiesVariable from '../variables/BrowserPropertiesVariable.vue';

const componentMap: Record<any, any> = {
  [SourceType.Constant]: ConstantVariable,
  [SourceType.Expression]: ComputedVariable,
  [SourceType.QueryParameter]: QueryVariable,
  [SourceType.AsyncParameters]: RequestVariable,
  [SourceType.Time]: TimeVariable,
  [SourceType.BrowserProperties]: BrowserPropertiesVariable,
};

const {
  configurations,
  updateConfigurations,
} = useConfigurationsStore();

const variableStorage = new VariableStorage();
const variableStorageProxy = new VueVariableStorageProxy(variableStorage);

const innerConfiguration = ref(JSON.parse(JSON.stringify(configurations)));

const addEmptyConfiguration = () => {
  const newVar = {
    name: 'New var' + Math.random().toString(36).substring(7),
    config: {
      valueType: Types.Primitive,
      type: SourceType.Constant,
      refreshType: RefreshType.None,
      value: '',
      description: '',
    },
  }
  innerConfiguration.value.push(newVar);

  console.log(innerConfiguration.value);
}

const saveConfiguration = () => {
  updateConfigurations(innerConfiguration.value);
  innerConfiguration.value = JSON.parse(JSON.stringify(configurations));
};

const removeConfiguration = (name: string) => {
  const index = innerConfiguration.value.findIndex((config: ConfigurationDTO) => config.name === name);
  innerConfiguration.value.splice(index, 1);
};

const cancelConfiguration = () => {
  innerConfiguration.value = JSON.parse(JSON.stringify(configurations));
};

const isSaveAndCancelDisabled = computed(() => {
  return JSON.stringify(innerConfiguration.value) === JSON.stringify(configurations);
});
</script>

<template>
  <div class="config-container">
    <VaButton class="mb-3" @click="addEmptyConfiguration" icon="add" color="primary">Add New</VaButton>
    <div class="config-container__record" v-for="(config, index) in innerConfiguration" :key="config.name">
      <div class="config-container__details">
        <VaInput v-model="config.name" label="Name" />
        <VaSelect v-model="config.config.type" :options="Object.values(SourceType)" label="Type" />
        <component
          :is="componentMap[config.config.type]"
          :config="config"
          :variableStorageProxy="variableStorageProxy"
          :key="index"
        />
        <VaButton class="dlt-btn" @click="removeConfiguration(config.name)" icon="delete" color="danger"></VaButton>
      </div>
 
      <div style="width: 100%;">
        <VaDivider />
      </div>
    </div>
  </div>
  <div class="config-controls">
    <VaButton @click="cancelConfiguration" icon="clear" color="primary" :disabled="isSaveAndCancelDisabled">
      Reset
    </VaButton>
    <VaButton @click="saveConfiguration" icon="save" color="primary" :disabled="isSaveAndCancelDisabled">
      Save
    </VaButton>
  </div>
</template>

<style lang="scss">
.config-container {
  display: flex;
  flex-direction: column;
  padding: 16px;
  margin: 16px 16px 0 16px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  height: 100%;
  overflow-x: hidden;
  box-sizing: border-box;

  &__record {
    display: flex;
    flex-direction: row;
    gap: 10px;
    flex-wrap: wrap;
  }

  &__details {
    display: grid;
    grid-template-columns: repeat(10, 1fr);
    gap: 10px;
    width: 100%;
  }

  button {
    align-self: flex-end;
  }

  .va-input-label {
    font-size: 8px;
  }

  .va-select {
    width: 120px !important;
    font-size: 12px;
  }

  .va-select-option-list {
    font-size: 12px;
  }

  .va-input {
    width: 120px !important;
    font-size: 12px;
  }

}

.dlt-btn {
  grid-column-start: 10;
  justify-self: end;
}

.config-controls {
  align-self: self-end;

  button {
    margin: 16px 16px 16px 0;
  }
}
</style>