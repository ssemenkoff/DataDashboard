<script setup lang="ts">
import { toRefs, computed, getCurrentInstance, onMounted } from 'vue';
import { useWidgetStore } from '@/plugins/data/WidgetsPinia';

const props = defineProps<{ widget: any }>();
const { widget } = toRefs(props);

const { removeWidget } = useWidgetStore();

const instance = getCurrentInstance();
const availableWidgets = instance?.appContext.config.globalProperties.availableWidgets;

const isWidgetRegistered = computed(() => {
  return availableWidgets && availableWidgets[widget.value.type];
});

const deleteWidget = (id: string): void => {
  removeWidget(id);
}

const openSettings = (name: string): void => {
  console.log(name)
}
</script>

<template>
  <div class="wrapper" v-if="isWidgetRegistered">
    <component
      :is="widget.type"
      :config="widget.config"
      :datasourceId="widget.config.datasourceId"
      @deleteWidget="deleteWidget(widget.uid)"
      @openSettings="openSettings(widget.config.settings.name)"
    />
  </div>
  <div v-else>
    <p>Widget type {{ widget.type }} is not registered.</p>
  </div>
</template>

<style scoped>
.wrapper {
  max-width: 350px;
  max-height: 250px;
  width: 100%;
  height: 100%;
  min-width: 150px;
  min-height: 150px;
  border: 1px solid #ccc;
  border-radius: 5px;
  box-sizing: border-box;
}
</style>