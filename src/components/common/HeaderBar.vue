<script lang="ts" setup>
import { useDataSourcesStore } from '@/plugins/data/DatasourcePinia';
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { useSerialization } from '@/composables/useSerialization';
import { useConfigurationsStore } from '@/plugins/data/ConfigurationPinia';
import { useConnectionsStore } from '@/plugins/data/ConnectionsPinia';
import { useWidgetsStore } from '@/plugins/data/WidgetsPinia';
import { useLayoutStore } from '@/plugins/data/LayoutsPinia';

const { dataSources } = useDataSourcesStore();
const { configurations } = useConfigurationsStore();
const { connections } = useConnectionsStore();
const { widgets } = useWidgetsStore();
const { layout } = useLayoutStore();
const { getState, loadState } = useSerialization({
  configurations: configurations,
  datasources: dataSources,
  connections: connections,
  widgets: widgets,
  layout: layout,
})
const route = useRoute();
const props = defineProps({
  isSidebarHovered: Boolean
});

const headerPaddingLeft = computed(() => (props.isSidebarHovered ? '270px' : '70px'));

const headerTitle = computed(() => {
  switch(route.name) {
    case 'home':
      return 'Report Vue';
    case 'about':
      return 'Edit Report';
    case 'data':
      return 'Data Designer';
    case 'config':
      return 'Configuration Editor';
    case 'test':
      return 'Test View';
  }
});

const saveStateToStorage = () => {
  const serState = getState();
  localStorage.setItem("APP_STATE", serState);
};

const loadStateFromStorage = () => {
  const state = localStorage.getItem("APP_STATE");

  loadState(state);
}
</script>

<template>
  <div class="header" :style="{ paddingLeft: headerPaddingLeft }">
    <h2 class="header__title">{{ headerTitle }}</h2>
    <div class="header__state-controls" style="display: flex; align-items: center; box-sizing: border-box;">
      <VaButton class="mr-2" @click="saveStateToStorage" icon="save">Save</VaButton>
      <VaButton class="mr-2" @click="loadStateFromStorage" icon="download">Load</VaButton>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.header {
  position: absolute;
  display: flex;
  width: 100%;
  top: 0;
  left: 0;
  height: 58px;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px dashed #e0e0e0;
  transition: padding-left 0.23s ease;

  &__title {
    text-align: left;
  }

  &__state-controls {
    display: flex;
    align-items: center;
  }
}
</style>