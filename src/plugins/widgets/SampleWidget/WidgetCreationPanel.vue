<script lang="ts" setup>
import { useDataSourcesStore } from '@/plugins/data/DatasourcePinia';
import { computed, onMounted, ref, watch } from 'vue';
import {widgetFactory} from '@/plugins/widgets/SampleWidget/WidgetFactory';
import Draggable from 'vuedraggable';
import { useLayoutStore } from '@/plugins/data/LayoutsPinia';

const selectedDatasourceName = ref("");
const selectedDatasourceId = ref("");
const widgetTypes = [
  { type: 'SampleWidget'},
  { type: 'ChartWidget' },
  { type: 'TextWidget' },
  { type: 'ImageWidget' },
  { type: 'VideoWidget' },
  { type: 'TableWidget' }
];
const { layout } = useLayoutStore();
const emit = defineEmits(['saveLayout', 'resetLayout', 'closePanel'
]);
const props = defineProps({
  innerLayout: Array,
});

const isSaveResetDisabled = computed(() => {
  return JSON.stringify(props.innerLayout) === JSON.stringify(layout);
});

watch(selectedDatasourceId, (id) => {
  if (id) {
    widgetFactory.setDatasourceId(id);
  }
});

const { dataSources } = useDataSourcesStore();
const datasourceNames = computed(() => {
  return Object.values(dataSources).map(v => v.name);
});

onMounted(() => {
  const datasource = Object.values(dataSources).find(v => v.name === selectedDatasourceName.value);
  if (datasource) {
    selectedDatasourceId.value = datasource.uid;
  }
});

watch(selectedDatasourceName,() => {
  const datasource = Object.values(dataSources).find(v => v.name === selectedDatasourceName.value);
  if (datasource) {
    selectedDatasourceId.value = datasource.uid;
  }
});

const onDragStart = (event: DragEvent, type: string) => {
  event.dataTransfer?.setData("text/plain", type);
  const dragElement = document.createElement('div');
  document.body.appendChild(dragElement);
  event.dataTransfer?.setDragImage(dragElement, 0, 0);

  setTimeout(() => {
    document.body.removeChild(dragElement)
  }, 0);
};
</script>

<template>
  <div class="widget-creation-panel" >
    <VaSelect label="Datasource ID" v-model="selectedDatasourceName" :options="datasourceNames"/>
    <draggable
      class="widgets-type-list"
      :list="widgetTypes"
      :group="{ name: 'widgets', pull: 'clone', put: false }"
      itemKey="type"
    >
    <template #item="{ element }">
      <div
        class="widget-type-element"
        draggable="true"
        @dragstart="(event) => onDragStart(event, element.type)"
      >
      <span class="widget-type-name">{{ element.type }}</span>
      </div>
    </template>
    </draggable>
    <div class="creation-panel-controls">
      <VaButton class="control-btn" icon="save" @click="$emit('saveLayout')" :disabled="isSaveResetDisabled" />
      <VaButton class="control-btn" icon="undo" @click="$emit('resetLayout')" :disabled="isSaveResetDisabled" />
      <VaButton class="control-btn" icon="close" @click="$emit('closePanel')" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.widget-creation-panel {
  position: absolute;
  height: 90%;
  right: -300px;
  right: 0;
  top: 0;
  margin: 68px 32px 0 0;
  padding: 32px;
  border-radius: 5px;
  border: 1px solid #b1b1b1;
  background-color: #cfcfcf;

  .creation-panel-controls {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 4px;
  }
}

.widgets-type-list {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 32px;

  .widget-type-element {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 200px;
    height: 100px;
    border: 1px solid rgb(61, 60, 60);
    border-radius: 5px;
    margin-top: 24px;
    background-color: rgb(161, 200, 218);
    cursor: grab;
  }
}
</style>