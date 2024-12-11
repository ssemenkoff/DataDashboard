<script setup lang="ts">
import { toRefs, computed, getCurrentInstance, onMounted } from 'vue';
const props = defineProps<{ widget: any }>();
const { widget } = toRefs(props);

const instance = getCurrentInstance();
const availableWidgets = instance?.appContext.config.globalProperties.availableWidgets;

const isWidgetRegistered = computed(() => {
  return availableWidgets && availableWidgets[widget.value.type];
});

</script>

<template>
  <div class="wrapper" v-if="isWidgetRegistered">
    <component
      :is="widget.type"
      :config="widget.config"
      :datasourceId="widget.config.datasourceId"
    />
  </div>
  <div class="wrapper" v-else>
    <div>Widget type {{ widget.type }} is not registered.</div>
  </div>
</template>

<style scoped>
.wrapper {
  width: 100%;
  height: 100%;
  border: 1px solid #ccc;
  border-radius: 5px;
  padding: 12px;
  box-sizing: border-box;
  background-color: white;
  cursor: pointer;
}
</style>