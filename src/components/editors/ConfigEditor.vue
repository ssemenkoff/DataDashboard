<script lang="ts" setup>
import { useConfigurationsStore, type ConfigurationDTO } from '@/plugins/data/ConfigurationPinia';
import { Types, RefreshType, SourceType } from '@/types/enum';
import { computed, watch, ref } from 'vue';
import { VariableStorage } from '@/plugins/variables/VariableStorage';
import { VueVariableStorageProxy } from '@/plugins/variables/VueVariableStorageProxy';

const {
  configurations,
  updateConfigurations,
} = useConfigurationsStore();


const variableStorage = new VariableStorage();
const variableStorageProxy = new VueVariableStorageProxy(variableStorage);

const innerConfiguration = ref(JSON.parse(JSON.stringify(configurations)));
const innerVariables = ref((() => {
  return innerConfiguration.value.map((config: ConfigurationDTO) => {
    return variableStorageProxy.createVariable(config.name, config.config as any);
  });
})());

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

  const ref = variableStorageProxy.createVariable(newVar.name, newVar.config);

  innerConfiguration.value.push(newVar);
  innerVariables.value.push(ref);

  console.log(innerConfiguration.value);
}

watch(() => innerConfiguration.value, (newVal, oldVal) => {
  newVal.forEach((config: ConfigurationDTO) => {
    const variable = innerVariables.value.find((variable: any) => variable.name === config.name);

    if (variable) {
      innerVariables.value.splice(innerVariables.value.indexOf(variable), 1);
      variableStorageProxy.removeVariable(variable.name);
    }

    const newVar = variableStorageProxy.createVariable(config.name, config.config as any);
    innerVariables.value.push(newVar);
  });

  innerVariables.value.forEach((variable: any) => {
    const config = innerConfiguration.value.find((config: ConfigurationDTO) => config.name === variable.name);

    if (!config) {
      innerVariables.value.splice(innerVariables.value.indexOf(variable), 1);
      variableStorageProxy.removeVariable(variable.name);
    }
  });

  console.log(innerVariables.value);
}, { deep: true });

const saveConfiguration = () => {
  updateConfigurations(innerConfiguration.value);
};

const removeConfiguration = (name: string) => {
  const index = innerConfiguration.value.findIndex((config: ConfigurationDTO) => config.name === name);
  innerConfiguration.value.splice(index, 1);

  const variableIndex = innerVariables.value.findIndex((variable: any) => variable.name === name);
  innerVariables.value.splice(variableIndex, 1);
};

const cancelConfiguration = () => {
  innerConfiguration.value = JSON.parse(JSON.stringify(configurations));
};

const isSaveAndCancelDisabled = computed(() => {
  return JSON.stringify(innerConfiguration.value) === JSON.stringify(configurations);
});

const getVariableObject = (config) => {
  return innerVariables.value.find((variable: any) => variable.name === config.name) || {};
};
</script>

<template>
  <div class="config-container">
    <VaButton @click="addEmptyConfiguration" icon="add" color="primary">Add New</VaButton>
    <div class="config-container--record" v-for="(config, index) in innerConfiguration" :key="config.name">
      <VaInput v-model="config.name" label="Name" />
      <VaSelect v-model="config.config.type" :options="Object.values(SourceType)" label="Type" />
      <template v-if="config.config.type === SourceType.Constant">
        <VaSelect v-model="config.config.valueType" :options="Object.values(Types)" label="Value Type" disabled />
        <VaInput v-model="config.config.value" label="Value" />
        <VaSelect v-model="config.config.refreshType" :options="Object.values(RefreshType)" label="Refresh" disabled />
        <div style="width: 200px; text-align: center; padding-top: 30px;">
          Value: {{ getVariableObject(config).value }}
        </div>
      </template>
      <template v-if="config.config.type === SourceType.Expression">
        <VaSelect v-model="config.config.valueType" :options="Object.values(Types)" label="Value Type" disabled />
        <VaInput v-model="config.config.expression" label="Expression" />
        <VaSelect v-model="config.config.refreshType" :options="Object.values(RefreshType)" label="Refresh" disabled />
        <div style="width: 200px; text-align: center; padding-top: 30px;">
          Value: {{ getVariableObject(config).value }}
        </div>
      </template>
      <template v-if="config.config.type === SourceType.Time">
        <VaSelect v-model="config.config.valueType" :options="Object.values(Types)" label="Value Type" disabled />
        <VaSelect v-model="config.config.refreshType" :options="Object.values(RefreshType)" label="Refresh" />
        <VaInput v-model="config.config.refreshInterval" type="number" label="Interval" />
        <div style="width: 200px; text-align: center; padding-top: 30px;">
          Value: {{ getVariableObject(config).value }}
        </div>
      </template>
      <template v-if="config.config.type === SourceType.AsyncParameters">
        <VaSelect v-model="config.config.valueType" :options="Object.values(Types)" label="Value Type" disabled />
        <VaInput v-model="config.config.request" label="Request URL" />
        <VaSelect v-model="config.config.refreshType" :options="Object.values(RefreshType)" label="Refresh" />
        <VaInput v-model="config.config.refreshInterval" type="number" label="Interval" />
        <div style="width: 200px; text-align: center; padding-top: 30px;">
          Value: {{ getVariableObject(config).value }}
        </div>
      </template>
      <template v-if="config.config.type === SourceType.QueryParameter">
        <VaSelect v-model="config.config.valueType" :options="Object.values(Types)" label="Value Type" disabled />
        <VaInput v-model="config.config.queryParam" label="Query Parameter" />
        <VaSelect v-model="config.config.refreshType" :options="Object.values(RefreshType)" label="Refresh" disabled />
        <div style="width: 200px; text-align: center; padding-top: 30px;">
          Value: {{ getVariableObject(config).value }}
        </div>
      </template>
      <!-- <VaSelect v-model="config.config.type" :options="Object.values(Types)" label="Type" />
      <VaInput v-model="config.config.expression" label="Expression" />
      <VaSelect v-model="config.config.refresh" :options="Object.values(RefreshType)" label="Refresh" />
      <VaInput v-model="config.config.interval" label="Interval" />
      <VaInput v-model="config.defaultValue" label="Default Value" /> -->
      <VaButton @click="removeConfiguration(config.name)" icon="delete" color="danger"></VaButton>
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

<style lang="scss" scope>
.config-container {
  display: flex;
  flex-direction: column;
  padding: 16px;
  margin: 16px 16px 0 16px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  height: 100%;
  overflow: auto;
  box-sizing: border-box;

  &--record {
    display: flex;
    flex-direction: row;
    gap: 10px;
    margin: 16px;
    flex-wrap: wrap;
  }

  button {
    align-self: flex-end;
  }
}

.config-controls {
  align-self: self-end;

  button {
    margin: 16px 16px 16px 0;
  }
}
</style>