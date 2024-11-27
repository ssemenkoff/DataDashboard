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
  </div>
</template>

<style scoped>
.widget {
  width: 100%;
  height: 100%;
  position: relative;
}

.widget-content {
  padding: 12px;
}
</style>