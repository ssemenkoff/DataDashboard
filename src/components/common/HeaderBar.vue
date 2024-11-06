<script lang="ts" setup>
import { useDataSourcesStore } from '@/plugins/data/DatasourcePinia';
import { computed, watch } from 'vue';
import { useRoute } from 'vue-router';

const { dataSources } = useDataSourcesStore();
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

const saveState = () => {
  console.log(JSON.stringify(dataSources));
}
</script>

<template>
  <div class="header" :style="{ paddingLeft: headerPaddingLeft }">
    <h2 class="header__title">{{ headerTitle }}</h2>
    <div class="header__state-controls" style="display: flex; align-items: center; box-sizing: border-box;">
      <VaButton class="mr-2" @click="saveState" icon="save">Save</VaButton>
      <VaButton class="mr-2" @click="console.log('load')" icon="download">Load</VaButton>
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