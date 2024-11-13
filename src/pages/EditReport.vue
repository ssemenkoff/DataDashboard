<script setup lang="ts">
import { ref, onMounted, watch, getCurrentInstance } from 'vue';
import WidgetWrapper from '@/plugins/widgets/Wrapper/WidgetWrapper.vue';
import { useDataSourcesStore } from '@/plugins/data/DatasourcePinia';
import { useWidgetsStore } from '@/plugins/data/WidgetsPinia';

const selectedDatasourceName = ref("");
const selectedDatasourceId = ref("");
const { dataSources } = useDataSourcesStore();

const datasourceNames = ref([] as string[]);
const { widgets, createWidget } = useWidgetsStore();
const instance = getCurrentInstance();

onMounted(() => {
  datasourceNames.value = Object.values(dataSources).map(v => v.name);
  const datasource = Object.values(dataSources).find(v => v.name === selectedDatasourceName.value);
  if (datasource) {
    selectedDatasourceId.value = datasource.uid;
  }
});

watch(selectedDatasourceName,() => {
  datasourceNames.value = Object.values(dataSources).map(v => v.name);
  const datasource = Object.values(dataSources).find(v => v.name === selectedDatasourceName.value);
  if (datasource) {
    selectedDatasourceId.value = datasource.uid;
  }
});

const addWidget = () => {
  if (selectedDatasourceName.value) {
    createWidget("SampleWidget", 
    {
      datasourceId: selectedDatasourceId.value,
    });
  }
};
</script>

<template>
  <div class="report-container">
    <!-- <div class="report-container__title">
      <h1>Edit Report</h1>
    </div> -->
    <div class="widgets-adding-controls">
      <VaSelect label="Datasource ID" class="mx-3 my-3" v-model="selectedDatasourceName" :options="datasourceNames"/>
      <VaButton class="add-btn" icon="add" @click="addWidget">Add</VaButton>
    </div>
    <div class="widget-board">
      <WidgetWrapper v-for="widget in widgets" :key="widget.uid" :widget="widget" />
    </div>
  </div>
  
</template>

<style scoped lang="scss">
.report-container {
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  flex-direction: column;
  width: 100%;

  &__title {
    width: 100%;
    padding: 16px;
    border-bottom: 1px dashed #e0e0e0;
  }

  .widgets-adding-controls {
    display: flex;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    margin: 16px;
  }

  .widget-board {
    width: 100%;
    height: 100%;
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    grid-template-rows: repeat(5, 1fr);
    gap: 35px;
    padding: 35px 35px 0 35px;
    grid-auto-flow: row;
    box-sizing: border-box;
    overflow-y: auto;
    overflow-x: hidden;
  }

  .add-btn {
    margin: 0 16px 16px 0;
    align-self: self-end;
  }
}
</style>
