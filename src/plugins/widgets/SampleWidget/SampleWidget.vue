<script setup lang="ts">
import { useDatasourceRepository } from '@/plugins/widgets/composables/datasourceRepository';
import { toRefs } from 'vue';

const props = defineProps<{ storeName: string }>();
const { storeName } = toRefs(props);

const { data } = useDatasourceRepository(storeName);
</script>

<template>
  <div class="greetings">
    <h3>
      Some text, {{ data }}
    </h3>
  </div>
</template>

<style scoped></style>