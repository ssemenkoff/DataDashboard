import { ref, computed, getCurrentInstance } from 'vue'
import { defineStore } from 'pinia'

export interface DataSourceDTO {
  uid: string;
  name: string;
  type: string;
  config?: {
    [key: string]: any;
  },
}

export const useDataSourcesStore = defineStore('datasource', () => {
  const dataSources = ref([] as DataSourceDTO[]);
  const instance = getCurrentInstance();
  
  const createDataSource = (type: any, config: any = {}) => {
    const uid = Math.random().toString(36).substring(7);
    const name = 'DataSource ' + uid;

    const datasourceRepository = instance?.appContext.config.globalProperties.datasourceRepository;

    datasourceRepository.registerDatasource(uid, type, config);
    dataSources.value.push({ uid, type, name, config });
  }

  const removeDataSource = (dataSourceId: string) => {
    const index = dataSources.value.findIndex(c => c.uid === dataSourceId);

    if (index > -1) {
      dataSources.value.splice(index, 1);
    }
  }

  const updateDataSource = (dataSourceId: string, dataSourceProxy: DataSourceDTO) => {
    const dataSource = dataSources.value.find(c => c.uid === dataSourceId);

    if (!dataSource) return;

    dataSource.uid = dataSourceProxy.uid;
    dataSource.type = dataSourceProxy.type;
    dataSource.name = dataSourceProxy.name;
    dataSource.config = dataSourceProxy.config;

    const datasourceRepository = instance?.appContext.config.globalProperties.datasourceRepository;
    datasourceRepository.registerDatasource(dataSourceId, dataSource.type, dataSource.config);
    console.log(datasourceRepository);
  }

  return { dataSources, createDataSource, removeDataSource, updateDataSource }
})
