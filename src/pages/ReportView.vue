<script setup lang="ts">
import { useConnectionsStore } from "@/plugins/data/ConnectionsPinia";
import { useDataSourcesStore } from "@/plugins/data/DatasourcePinia";
import { VueVariableStorageProxy } from "@/plugins/variables/VueVariableStorageProxy";
import { ref, getCurrentInstance } from "vue";
import { RefreshType } from '@/plugins/variables/RefreshTypes';

const { dataSources } = useDataSourcesStore();
const { connections } = useConnectionsStore();

const instance = getCurrentInstance();
const variables = instance?.appContext.config.globalProperties.$variableStorage as VueVariableStorageProxy;

const a = variables.createVariable('constant', 'a', {
  value: 1,
  description: 'Variable A',
  refreshType: RefreshType.None
});

const b = variables.createVariable('constant', 'b', {
  value: 2,
  description: 'Variable B',
  refreshType: RefreshType.None
});

const c = variables.createVariable('computed', 'c', {
  expression: '$a + $b + 2',
  description: 'Variable C',
  refreshType: RefreshType.None
});

const d = variables.createVariable('computed', 'd', {
  expression: '$a + $b + 2',
  description: 'Variable D',
  refreshType: RefreshType.None
});

const e = variables.createVariable('query', 'e', {
  queryParam: 's',
  description: 'Variable E',
  refreshType: RefreshType.None
});

const f = variables.createVariable('request', 'f', {
  request: 'https://glances.ssemenkoff.dev/api/4/cpu/total',
  description: 'Variable F',
  refreshType: RefreshType.Interval,
  refreshInterval: 1000,
});

const g = variables.createVariable('time', 'g', {
  description: 'Variable G',
  refreshType: RefreshType.Interval,
  refreshInterval: 1000,
});


const vars = ref([a, b, c, d, e, f, g]);

const newVarName = ref('');
const newVarType = ref('constant');

const addVar = () => {
  const newVar = variables.createVariable(newVarType.value, newVarName.value, {
    value: 0,
    description: 'New Variable',
    refreshType: RefreshType.None
  });

  newVarName.value = '';
  newVarType.value = 'constant';
  vars.value.push(newVar);
};

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
    <div style="padding-top: 10px; margin-top: 10px; border-top: 1px solid silver;">
      <div>
        Variables
      </div>
      <div style="display: flex; flex-direction: column; gap: 8px;padding-left: 20px;">


        <div v-for="variable in vars" :key="variable.name" class="var-item">
          <template v-if="variable.type === 'constant'">
            <va-input v-model="variable.name" label="Name" />
            <va-input v-model="variable.value" type="number" label="Value" />
            <va-input v-model="variable.description" label="Description" />
          </template>
          <template v-else-if="variable.type === 'computed'">
            <va-input v-model="variable.name" label="Name" />
            <va-input v-model="variable.expression" label="Expression" />
            <va-input v-model="variable.description" label="Description" />
            <va-input v-model="variable.value" readonly label="Value" />
          </template>
          <template v-else-if="variable.type === 'query'">
            <va-input v-model="variable.name" label="Name" />
            <va-input v-model="variable.parameter" label="Query Parameter" />
            <va-input v-model="variable.description" label="Description" />
            <div>Value: {{ variable.value }}</div>
          </template>
          <template v-else-if="variable.type === 'request'">
            <va-input v-model="variable.name" label="Name" />
            <va-input v-model="variable.request" label="Request" />
            <va-input v-model="variable.description" label="Description" />
            <div>Value: {{ variable.value }}, updatedAt: {{ variable.updateTimestamp }}</div>
          </template>
          <template v-else-if="variable.type === 'time'">
            <va-input v-model="variable.name" label="Name" />
            <va-input v-model="variable.description" label="Description" />
            <div>Value: {{ variable.value }}, updatedAt: {{ variable.updateTimestamp }}</div>
          </template>
        </div>

        <div class="var-item" style="margin-top: 10px; padding-top: 10px; border-top: 1px solid silver">
          <va-input v-model="newVarName" label="Name" />
          <va-select v-model="newVarType" label="Type" :options="['constant', 'computed']" />
          <va-button @click="addVar" style="align-self: flex-end;">Add Variable</va-button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.var-item {
  display: flex;
  flex-direction: row;
  align-items: flex-end;
  gap: 8px;
}
</style>
