<script setup lang="ts">
import { onMounted, shallowRef, getCurrentInstance, watch, ref } from 'vue';
const props = defineProps<{ dataSource: any }>();

const instance = getCurrentInstance();
const constructor = instance?.appContext.config.globalProperties.datasourceConfig.availableDatasources['REST'];
const tempStore = shallowRef(null as any);
const selectedFilter = ref("");
const selectedValue = ref("");

const data = ref(null);
const selectedData = ref(null);

onMounted(async () => {
  if (constructor.validateConfiguration(props.dataSource.config)) {
    tempStore.value = new constructor(props.dataSource.config);

    const req = await tempStore.value.getData();
    const selReq = await tempStore.value.getSelectedData();
    data.value = req;
    selectedData.value = selReq;
  }
});

watch(() => props.dataSource, async () => {
  if (constructor.validateConfiguration(props.dataSource.config)) {
    tempStore.value = new constructor(props.dataSource.config);

    const req = await tempStore.value.getData();
    const selReq = await tempStore.value.getSelectedData();
    data.value = req;
    selectedData.value = selReq;
  }
}, { deep: true });

const handleSelectedChange = (nV: string, oV: string) => {
  selectedValue.value = nV;
};

watch(selectedValue, (nV) => {
  let result = '';
  const parts = nV.replace('root.', '').split('.');

  parts.forEach((part) => {
    let processedPart = '';
    for (let char of part) {
      if (char === '[' || char === ']') {
        processedPart += '/';
      } else {
        processedPart += char;
      }
    }
    result += `/${processedPart}`
  })
  console.log(result);
  props.dataSource.config.selectedJSONValue = result;
});
</script>

<template>
  <div class="rest-preview-container" v-if="tempStore">
    <div class="selected-json-filters">
      <div class="selected-json-value">
        <VaInput v-model="selectedValue" label="Selected Field"/>
      </div>
      <div class="selected-json-filter-controls">
        <VaSelect class="ml-2" v-model="selectedFilter" label="Filters" :options="['filter1', 'filter2', 'filter3']" />
        <VaButton class="ml-2 mt-3">Add filter</VaButton>
      </div>
    </div>
    <div class="original-json-preview">
      <VueJsonPretty
        :data="data"
        v-model:selectedValue="selectedValue"
        @selectedChange="handleSelectedChange"
        showSelectController
        highlightSelectedNode
        collapsedOnClickBrackets
        selectableType="single"
        editable
      />
    </div>
    <div v-if="!selectedData" class="selected-json-preview selected-json-preview__without-data"></div>
    <div v-else="selectedData && selectedValue" class="selected-json-preview">
      <VueJsonPretty
        :data="selectedData"
      />
    </div>
  </div>
</template>

<style scoped lang="scss">
.rest-preview-container {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: repeat(4, 1fr);
  grid-gap: 16px;
  overflow: hidden;
  width: 100%;
  height: 100%;
}

.selected-json-filters {
  display: flex;
  border: 1px solid #ccc;
  border-radius: 5px;
  padding: 16px;
  grid-row-start: 1;
  grid-column-start: 1;
  grid-row-end: 2;
  grid-column-end: 3;
}

.original-json-preview {
  border: 1px solid #ccc;
  border-radius: 5px;
  padding: 16px;
  grid-row-start: 2;
  grid-column-start: 1;
  grid-row-end: 5;
  grid-column-end: 2;
  overflow: auto;
}

.selected-json-preview {
  border: 1px solid #ccc;
  border-radius: 5px;
  padding: 16px;
  grid-row-start: 2;
  grid-column-start: 2;
  grid-row-end: 5;
  grid-column-end: 3;
  overflow: auto;
  
  &__without-data {
    background: #c0c0c0;
  }
}
</style>
