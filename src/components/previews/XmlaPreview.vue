<script setup lang="ts">
import MonacoEditor from '../common/monacoEditor/MonacoEditor.vue';

const props = defineProps<{ dataSource: any }>();
</script>
<template>
  <div class="xmla-preview">
    <MonacoEditor :modelValue="'code'" />
  </div>
</template>
<style scoped lang="scss">
.xmla-preview {
  height: 100%;
}
</style>