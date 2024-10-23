import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { Types, RefreshTypes, SourceTypes } from '@/types/enum';

export interface IConfiguration {
  uid: string;
  name: string;
  type: Types;
  sourceType: SourceTypes;
  expression: string;
  refresh: RefreshTypes;
  interval: number;
  defaultValue: string;
}

export const useConfigurationsStore = defineStore('configurations', () => {
  const configurations = ref([] as IConfiguration[]);
  const previousConfigurations = ref([] as IConfiguration[]);
  
  const savePreviousState = () => {
    previousConfigurations.value.splice(0, configurations.value.length, ...JSON.parse(JSON.stringify(configurations.value)));
  }

  const restorePreviousState = () => {
    configurations.value.splice(0, configurations.value.length, ...JSON.parse(JSON.stringify(previousConfigurations.value)));
  }

  const createConfiguration = (config: IConfiguration) => {

    const uid = Math.random().toString(36).substring(7);
    configurations.value.push({
      uid,
      name: config.name || '',
      type: config.type || '',
      sourceType: config.sourceType || '',
      expression: config.expression || '',
      refresh: config.refresh || '',
      interval: config.interval || 0,
      defaultValue: config.defaultValue || ''
    });
  }

  const removeConfiguration = (configurationId: string) => {
    const index = configurations.value.findIndex((c) => c.uid === configurationId);

    if (index > -1) {
      configurations.value.splice(index, 1);
    }
  }

  const updateConfiguration = (configurationId: string, configurationProxy: IConfiguration) => {
    const configuration = configurations.value.find((c) => c.uid === configurationId);

    if (!configuration) return;

    configuration.uid = configurationProxy.uid;
    configuration.name = configurationProxy.name;
    configuration.type = configurationProxy.type;
    configuration.sourceType = configurationProxy.sourceType;
    configuration.expression = configurationProxy.expression;
    configuration.refresh = configurationProxy.refresh;
    configuration.interval = configurationProxy.interval;
    configuration.defaultValue = configurationProxy.defaultValue;
  }

  return {
    configurations,
    previousConfigurations,
    createConfiguration,
    removeConfiguration,
    updateConfiguration,
    savePreviousState,
    restorePreviousState
  }
})
