<script lang="ts" setup>
import type { ConfigurationDTO } from '@/plugins/data/ConfigurationPinia';
import { useVariableManager } from '@/plugins/variables/composables/variableManager';
import type { VueVariableStorageProxy } from '@/plugins/variables/VueVariableStorageProxy';
import { Types } from '@/types/enum';
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
  <VaInput v-model="config.config.queryParam" label="Parameter Name" />
  <VaSelect v-model="config.config.valueType" :options="Object.values(Types)" label="Value Type" />
  <!-- <VaSelect v-model="config.config.refreshType" :options="Object.values(RefreshType)" label="Refresh" disabled /> -->
  <VaInput v-model="config.config.defaultValue" label="Default Value" />
  <VaInput v-model="variable.value" label="Current Value" readonly />
</template>
