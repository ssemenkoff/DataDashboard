<script lang="ts" setup>
import { useConfigurationsStore, type IConfiguration } from '@/plugins/data/ConfigurationPinia';
import { Types, RefreshTypes, SourceTypes, } from '@/types/enum';
import { computed, watch, ref } from 'vue';

const {
  configurations,
  previousConfigurations,
  removeConfiguration,
  createConfiguration,
  updateConfiguration,
  restorePreviousState,
  savePreviousState,
} = useConfigurationsStore();

const addEmptyConfiguration = () => {
  createConfiguration({} as IConfiguration);
}

const saveConfiguration = () => {
  configurations.forEach(config => {
    if (config.uid) {
      updateConfiguration(config.uid, config);
    }
  });
  savePreviousState();
};

const cancelConfiguration = () => {
  restorePreviousState();
};

const isSaveAndCancelDisabled = computed(() => {
  return JSON.stringify(previousConfigurations) === JSON.stringify(configurations);
});
</script>

<template>
  <div class="config-container">
    <VaButton @click="addEmptyConfiguration" icon="add" color="primary">Add New</VaButton>
    <div class="config-container--record" v-for="(config, index) in configurations" :key="index">
      <VaInput v-model="config.name" label="Name" />
      <VaSelect
        v-model="config.type"
        :options="Object.values(Types)"
        label="Type"
        />
      <VaSelect 
        v-model="config.sourceType"
        :options="Object.values(SourceTypes)"
          label="Source Type"
        />
      <VaInput v-model="config.expression" label="Expression" />
      <VaSelect
      v-model="config.refresh"
        :options="Object.values(RefreshTypes)"
        label="Refresh"
      />
      <VaInput v-model="config.interval" label="Interval" />
      <VaInput v-model="config.defaultValue" label="Default Value" />
      <VaButton @click="removeConfiguration(config.uid)" icon="delete" color="danger"></VaButton>
    </div>
  </div>
  <div class="config-controls">
    <VaButton @click="cancelConfiguration" icon="clear" color="primary" :disabled="isSaveAndCancelDisabled">Cancel</VaButton>
    <VaButton @click="saveConfiguration" icon="save" color="primary" :disabled="isSaveAndCancelDisabled">Save</VaButton>
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