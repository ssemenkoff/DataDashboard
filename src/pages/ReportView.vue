<script setup lang="ts">
import { useConnectionsStore } from "@/plugins/data/ConnectionsPinia";
import { useDataSourcesStore } from "@/plugins/data/DatasourcePinia";

const { dataSources } = useDataSourcesStore();
const { connections } = useConnectionsStore();
</script>

<template>
  <div>
    Report View

    <div>
      <div>
        Available Connections
      </div>
      <div v-for="connection in connections" :key="connection.uid">
        {{ JSON.stringify(connection) }}
      </div>
      <div>
        Available DataSources
      </div>
      <div v-for="dataSource in dataSources" :key="dataSource.uid">
        {{ JSON.stringify(dataSource) }}
      </div>
    </div>
  </div>
</template>

<style scoped></style>
