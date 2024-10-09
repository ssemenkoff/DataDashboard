<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { debounce } from 'lodash';

const { config, connections } = defineProps<{
  config: any;
  connections: any;
  dataSources: any;
}>();

const tempResourceUrl = ref(config.resourceUrl);

const updateResourceUrl = debounce((newUrl: string) => {
  config.resourceUrl = newUrl;
}, 700);

watch(tempResourceUrl, (newUrl) => {
  updateResourceUrl(newUrl);
});

const connectionsFiltered = computed(() => {
  return connections.filter((c: any) => c.type === 'REST');
});

</script>

<template>
  <!-- eslint-disable-next-line vue/no-mutating-props -->
  <VaSelect v-model="config.connection" label="Connection" :options="connectionsFiltered" text-by="name"
    value-by="uid" />

  <!-- eslint-disable-next-line vue/no-mutating-props -->
  <VaInput v-model="tempResourceUrl" label="Resource Url" />
  <VaInput v-model="config.selectedJSONValue" label="Selected value" />
</template>