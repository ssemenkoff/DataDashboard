<script setup lang="ts">
import { onMounted, shallowRef, getCurrentInstance, watch, ref } from 'vue';
const props = defineProps<{ dataSource: any }>();

const instance = getCurrentInstance();
const constructor = instance?.appContext.config.globalProperties.datasourceConfig.availableDatasources['REST'];
const tempStore = shallowRef(null as any);

const data = ref(null);

onMounted(async () => {
  if (constructor.validateConfiguration(props.dataSource.config)) {
    tempStore.value = new constructor(props.dataSource.config);

    const req = await tempStore.value.getData();
    data.value = req;
  }
});

watch(() => props.dataSource, async () => {
  if (constructor.validateConfiguration(props.dataSource.config)) {
    tempStore.value = new constructor(props.dataSource.config);

    const req = await tempStore.value.getData();
    data.value = req;
  }
}, { deep: true });


</script>
<template>
  <div v-if="tempStore">
    <VueJsonPretty
      :data="data"
      v-model:selectedValue="props.dataSource.config.selectedJSONValue"
      showSelectController
      highlightSelectedNode
      collapsedOnClickBrackets
      selectableType="single"
      editable
    />
  </div>
</template>