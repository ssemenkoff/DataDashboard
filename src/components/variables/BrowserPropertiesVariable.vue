<script lang="ts" setup>
import type { ConfigurationDTO } from '@/plugins/data/ConfigurationPinia';
import { useVariableManager } from '@/plugins/variables/composables/variableManager';
import type { VueVariableStorageProxy } from '@/plugins/variables/VueVariableStorageProxy';
import { BrowserProperties } from '@/types/enum';
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
  <VaSelect v-model="config.config.valueType" :options="Object.values(BrowserProperties)" label="Browser Property Name" />
  <VaInput v-model="config.config.defaultValue" label="Expression" />
  <!-- <VaSelect v-model="config.config.refreshType" :options="Object.values(RefreshType)" label="Refresh" disabled /> -->
  <!-- <VaInput v-model="getVariableObject(config).value" label="Current Value" readonly/> -->
  <VaInput v-model="variable.value" label="Current Value" readonly />
</template>
