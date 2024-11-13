<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { debounce } from 'lodash';

const { config, connections } = defineProps<{
  config: any;
  connections: any;
  dataSources: any;
}>();

const tempResourceUrl = ref(config.resourceUrl);
const connection = connections.find((e) => config.connection === e.uid);
const fullUrl = computed(() => `${connection.config.url}${tempResourceUrl.value}`);
const available = ref(false);

const updateResourceUrl = debounce((newUrl: string) => {
  config.resourceUrl = newUrl;
}, 700);


watch(tempResourceUrl, async (newUrl) => {
  await updateResourceUrl(newUrl);
  config.selectedJSONValue = '';
  const resp = await checkUrl(fullUrl.value);
  available.value = resp.available;
});

const checkUrl = async (url: string) => {
  try {
    const response = await fetch(url, {method: "HEAD"});
    if(!response.ok) {
      return {available: false}
    } else {
      return {available: true}
    }
  } catch(error: any) {
    console.warn("Invalid resource URL", error.name);
    return {available: false}
  }
}

const connectionsFiltered = computed(() => {
  return connections.filter((c: any) => c.type === 'REST');
});

</script>

<template>
  <!-- eslint-disable-next-line vue/no-mutating-props -->
  <VaSelect v-model="config.connection" label="Connection" :options="connectionsFiltered" text-by="name"
    value-by="uid" />

  <!-- eslint-disable-next-line vue/no-mutating-props -->
  <VaInput v-model="tempResourceUrl" label="Resource Url" :rules="[() => available || `Invalid resource URL`]"/>
  <VaInput v-model="config.selectedJSONValue" label="Selected value" />
</template>