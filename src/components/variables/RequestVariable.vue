<script lang="ts" setup>
import type { ConfigurationDTO } from '@/plugins/data/ConfigurationPinia';
import { useVariableManager } from '@/plugins/variables/composables/variableManager';
import type { VueVariableStorageProxy } from '@/plugins/variables/VueVariableStorageProxy';
import { Types, RefreshType } from '@/types/enum';
import { onBeforeMount, ref } from 'vue';

const { config, variableStorageProxy } = defineProps<{
  config: ConfigurationDTO;
  variableStorageProxy: VueVariableStorageProxy;
}>();

const { variable, createVariable, removeVariable } = useVariableManager(
  ref(config),
  variableStorageProxy
);

onBeforeMount(() => {
  createVariable();
});
</script>

<template>
  <VaInput v-model="config.config.request" label="Request URL" />
  <VaSelect v-model="config.config.valueType" :options="Object.values(Types)" label="Value Type" />
  <VaInput v-model="config.config.defaultValue" label="Default Value" />
  <VaSelect v-model="config.config.refreshType" :options="Object.values(RefreshType)" label="Refresh Type" />
  <VaInput
    v-if="config.config.refreshType === 'Interval'"
    v-model="config.config.refreshInterval"
    type="number"
    label="Interval"
    placeholder="10s"
  />
  <VaInput
    v-if="config.config.refreshType === 'Trigger'"
    v-model="config.config.triggerEventName"
    label="Trigger Event Name"
    placeholder="Update"
  />
  <!-- <VaSelect v-model="config.config.refreshType" :options="Object.values(RefreshType)" label="Refresh" disabled /> -->
  <VaInput v-model="variable.value" label="Current Value" readonly />
</template>
