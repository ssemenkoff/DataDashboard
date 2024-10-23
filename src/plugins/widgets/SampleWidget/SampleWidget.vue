<script setup lang="ts">
import { useDatasourceRepository } from '@/plugins/widgets/composables/datasourceRepository';
import { toRefs } from 'vue';

const props = defineProps<{ datasourceId: string }>();
const { datasourceId } = toRefs(props);

const { data } = useDatasourceRepository(datasourceId);
</script>

<template>
  <div class="widget">
    <VaScrollContainer
        color="#133370"
        vertical
      >  
      <div class="widget-content">
        {{ data ?? 'Data do not created' }}
      </div>
    </VaScrollContainer>
    <div class="widget-controls">
      <VaButton class="control-button" @click="$emit('openSettings')" icon="settings" size="small"></VaButton>
      <VaButton class="control-button" @click="$emit('deleteWidget')" icon="close" color="danger" size="small"></VaButton>
    </div>
  </div>
</template>

<style scoped>
.widget {
  max-width: 350px;
  max-height: 250px;
  width: 100%;
  height: 100%;
  min-width: 150px;
  min-height: 150px;
  position: relative;
}

.widget-content {
  padding: 12px;
}

.widget-controls {
  position: absolute;
  top: -25px;
  right: 0;
  display: flex;
  justify-content: flex-end;
  background-color: white;
  z-index: 10;

  .control-button {

  }

}
</style>